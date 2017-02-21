// angular
import { inject } from '@angular/core/testing';

// module
import { ConfigLoader, ConfigStaticLoader, ConfigService } from '../index';
import { testSettings, testModuleConfig } from './index.spec';

describe('@nglibs/config:',
    () => {
        beforeEach(() => {
            function configFactory(): ConfigLoader {
                return new ConfigStaticLoader(testSettings);
            }

            testModuleConfig({ provide: ConfigLoader, useFactory: (configFactory) });
        });

        describe('ConfigService',
            () => {
                it('is defined',
                    inject([ConfigService],
                        (config: ConfigService) => {
                            expect(ConfigService).toBeDefined();
                            expect(config).toBeDefined();
                            expect(config instanceof ConfigService).toBeTruthy();
                        }));

                it('should be able to get all settings',
                    inject([ConfigService],
                        (config: ConfigService) => {
                            config.loader.loadSettings()
                                .then(() => {
                                    expect(config.getSettings()).toEqual(testSettings);
                                });
                        }));

                it('should be able to get settings using `group`',
                    inject([ConfigService],
                        (config: ConfigService) => {
                            config.loader.loadSettings()
                                .then(() => {
                                    expect(config.getSettings('system'))
                                        .toEqual({
                                            'applicationName': 'Mighty Mouse',
                                            'applicationUrl': 'http://localhost:8000'
                                        });
                                    expect(config.getSettings('system').applicationName).toEqual('Mighty Mouse');
                                    expect(config.getSettings('system').applicationUrl).toEqual('http://localhost:8000');
                                    expect(config.getSettings('i18n'))
                                        .toEqual({
                                            'locale': 'en'
                                        });
                                    expect(config.getSettings('i18n').locale).toEqual('en');
                                });
                        }));

                it('should throw if you provide an invalid `group`',
                    inject([ConfigService],
                        (config: ConfigService) => {
                            config.loader.loadSettings()
                                .then(() => {
                                    expect(() => {
                                            config.getSettings('layout');
                                        })
                                        .toThrowError('No setting found with the specified group [layout]!');
                                });
                        }));

                it('should be able to get settings using `group`/`key` combination',
                    inject([ConfigService],
                        (config: ConfigService) => {
                            config.loader.loadSettings()
                                .then(() => {
                                    expect(config.getSettings('system', 'applicationName')).toEqual('Mighty Mouse');
                                    expect(config.getSettings('system', 'applicationUrl')).toEqual('http://localhost:8000');
                                    expect(config.getSettings('i18n', 'locale')).toEqual('en');
                                });
                        }));

                it('should throw if you provide an invalid `key`',
                    inject([ConfigService],
                        (config: ConfigService) => {
                            config.loader.loadSettings()
                                .then(() => {
                                    expect(() => {
                                            config.getSettings('system', 'workingTheme');
                                        })
                                        .toThrowError('No setting found with the specified group/key [system/workingTheme]!');
                                });
                        }));
            });
    });
