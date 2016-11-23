// angular
import { getTestBed } from '@angular/core/testing';

// module
import { ConfigLoader, ConfigHttpLoader, ConfigService } from '../index';
import { apiEndpoint, testModuleConfig } from './index.spec';

describe('@nglibs/config:',
    () => {
        beforeEach(() => {
            function configFactory(): ConfigLoader {
                return new ConfigHttpLoader(apiEndpoint);
            }

            testModuleConfig({ provide: ConfigLoader, useFactory: (configFactory) });
        });

        describe('ConfigLoader',
            () => {
                it('should be able to return the default apiEndpoint',
                    () => {
                        const loader = new ConfigHttpLoader();
                        const loadedSettings = loader.getApiEndpoint();

                        expect(loadedSettings).toEqual(apiEndpoint);
                    });

                it('should be able to provide `ConfigHttpLoader`',
                    () => {
                        function configFactory(): ConfigLoader {
                            return new ConfigHttpLoader(apiEndpoint);
                        }

                        testModuleConfig({ provide: ConfigLoader, useFactory: (configFactory) });

                        const injector = getTestBed();
                        const config = injector.get(ConfigService);

                        expect(ConfigHttpLoader).toBeDefined();
                        expect(config.loader).toBeDefined();
                        expect(config.loader instanceof ConfigHttpLoader).toBeTruthy();
                    });

                it('should be able to provide any `ConfigLoader`',
                    () => {
                        class CustomLoader implements ConfigLoader {
                            getApiEndpoint(): string {
                                return apiEndpoint;
                            }
                        }

                        testModuleConfig({ provide: ConfigLoader, useClass: CustomLoader });

                        const injector = getTestBed();
                        const config = injector.get(ConfigService);

                        expect(CustomLoader).toBeDefined();
                        expect(config.loader).toBeDefined();
                        expect(config.loader instanceof CustomLoader).toBeTruthy();
                    });
            });
    });
