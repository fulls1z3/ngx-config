// angular
import { async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

// module
import { ConfigLoader, ConfigHttpLoader, ConfigService } from '../index';
import { mockBackendResponse, mockBackendError, apiEndpoint, testSettings, testModuleConfig } from './index.spec';

describe('@nglibs/config:',
    () => {
        beforeEach(() => {
            function configFactory(): ConfigLoader {
                return new ConfigHttpLoader(apiEndpoint);
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

                it('should throw if you provide no settings',
                    inject([MockBackend, ConfigService],
                        (backend: MockBackend, config: ConfigService) => {
                            // mock error
                            backend.connections.subscribe((c: MockConnection) => mockBackendError(c, '500'));

                            // this will produce error at the backend
                            config.init()
                                .then((res: any) => {
                                    expect(res).toThrowError('Error: apiEndpoint unreachable!');
                                });
                        }));

                it('should be able to get all settings',
                    async(inject([MockBackend, ConfigService],
                        (backend: MockBackend, config: ConfigService) => {
                            // mock response
                            backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testSettings));

                            config.init()
                                .then(() => {
                                    expect(config.getSettings()).toEqual(testSettings);
                                    expect(config.getSettings().system)
                                        .toEqual({
                                            'applicationName': 'Mighty Mouse',
                                            'applicationUrl': 'http://localhost:8000'
                                        });
                                    expect(config.getSettings().system.applicationName).toEqual('Mighty Mouse');
                                    expect(config.getSettings().system.applicationUrl).toEqual('http://localhost:8000');
                                    expect(config.getSettings().i18n)
                                        .toEqual({
                                            'locale': 'en'
                                        });
                                    expect(config.getSettings().i18n.locale).toEqual('en');
                                });
                        })));

                it('should be able to get settings using `group`',
                    async(inject([MockBackend, ConfigService],
                        (backend: MockBackend, config: ConfigService) => {
                            // mock response
                            backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testSettings));

                            config.init()
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
                        })));

                it('should be able to get settings using `group`/`key` combination',
                    async(inject([MockBackend, ConfigService],
                        (backend: MockBackend, config: ConfigService) => {
                            // mock response
                            backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testSettings));

                            config.init()
                                .then(() => {
                                    expect(config.getSettings('system', 'applicationName')).toEqual('Mighty Mouse');
                                    expect(config.getSettings('system', 'applicationUrl')).toEqual('http://localhost:8000');
                                    expect(config.getSettings('i18n', 'locale')).toEqual('en');
                                });
                        })));

                it('should throw if you provide an invalid `group`',
                    async(inject([MockBackend, ConfigService],
                        (backend: MockBackend, config: ConfigService) => {
                            // mock response
                            backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testSettings));

                            config.init()
                                .then(() => {
                                    expect(() => {
                                            config.getSettings('layout');
                                        })
                                        .toThrowError('Error: No setting found with the specified group [layout]!');
                                });
                        })));

                it('should throw if you provide an invalid `key`',
                    async(inject([MockBackend, ConfigService],
                        (backend: MockBackend, config: ConfigService) => {
                            // mock response
                            backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testSettings));

                            config.init()
                                .then(() => {
                                    expect(() => {
                                            config.getSettings('system', 'workingTheme');
                                        })
                                        .toThrowError('Error: No setting found with the specified group/key [system/workingTheme]!');
                                });
                        })));
            });
    });
