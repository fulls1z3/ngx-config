// angular
import { async, getTestBed, inject, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// libs
import { ConfigLoader, ConfigModule, ConfigService, ConfigStaticLoader } from '@ngx-config/core';

// module
import { ConfigMergeLoader } from '../index';

const testSettingsMain = {
  setting1: 'value1',
  setting2: 'from config.json',
  arr: [1, 2, 3],
  nested: {
    k1: 'v1',
    k2: 'v2 from config.json'
  }
};

const testSettingsLocal = {
  setting2: 'from config.local.json',
  setting3: 'value3',
  arr: [4, 5]
};

const testSettingsEnv = {
  setting4: 'value4',
  nested: {
    k2: 'v2 from env/test.json',
    k3: 'v3'
  }
};

const testSettingsMerged = {
  setting1: 'value1',
  setting2: 'from config.local.json',
  setting3: 'value3',
  setting4: 'value4',
  arr: [4, 5],
  nested: {
    k1: 'v1',
    k2: 'v2 from env/test.json',
    k3: 'v3'
  }
};

// test module configuration for each test
const testModuleConfig = (moduleOptions?: any) => {
  // reset the test environment before initializing it.
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
    .configureTestingModule({
      imports: [
        ConfigModule.forRoot(moduleOptions)
      ]
    });
};

describe('@ngx-config/merge-loader:',
  () => {
    it('should be able to provide `ConfigMergeLoader`',
      () => {
        const configFactory = () => new ConfigMergeLoader();

        testModuleConfig({
          provide: ConfigLoader,
          useFactory: (configFactory)
        });

        const injector = getTestBed();
        const config = injector.get(ConfigService);

        expect(ConfigMergeLoader).toBeDefined();
        expect(config.loader).toBeDefined();
        expect(config.loader instanceof ConfigMergeLoader).toBeTruthy();
      });

    describe('ConfigMergeLoader',
      () => {
        beforeEach(() => {
          const mainLoader = new ConfigStaticLoader(testSettingsMain);
          const localLoader = new ConfigStaticLoader(testSettingsLocal);
          const envLoader = new ConfigStaticLoader(testSettingsEnv);

          const configFactory = () => new ConfigMergeLoader([mainLoader, localLoader, envLoader]);

          testModuleConfig({
            provide: ConfigLoader,
            useFactory: (configFactory)
          });
        });

        it('should be able to retrieve and merge settings `in parallel`',
          async(inject([ConfigService],
            (config: ConfigService) => {
              config.loader.loadSettings()
                .then((res: any) => {
                  expect(res).toEqual(testSettingsMerged);
                });
            })));

        it('should be able to retrieve and merge settings `in parallel` w/some of the `loaders` are unavailable',
          async(() => {
            class UnavailableLoader implements ConfigLoader {
              loadSettings(): any {
                return Promise.reject('Endpoint unreachable!');
              }
            }

            const mainLoader = new ConfigStaticLoader(testSettingsMain);
            const localLoader = new UnavailableLoader();
            const envLoader = new ConfigStaticLoader(testSettingsEnv);

            const configFactory = () => new ConfigMergeLoader([mainLoader, localLoader, envLoader]);

            testModuleConfig({
              provide: ConfigLoader,
              useFactory: (configFactory)
            });

            const injector = getTestBed();
            const config = injector.get(ConfigService);

            const expectedSettings = {
              setting1: 'value1',
              setting2: 'from config.json',
              setting4: 'value4',
              arr: [1, 2, 3],
              nested: {
                k1: 'v1',
                k2: 'v2 from env/test.json',
                k3: 'v3'
              }
            };

            config.loader.loadSettings()
              .then((res: any) => {
                expect(res).toEqual(expectedSettings);
              });
          }));

        it('should throw w/o any reachable `loaders`',
          async(inject([ConfigService],
            (config: ConfigService) => {
            const configFactory = () => new ConfigMergeLoader();

            testModuleConfig({
              provide: ConfigLoader,
              useFactory: (configFactory)
            });

            config.loader.loadSettings()
              .catch((res: any) => {
                expect(res).toEqual('Loaders unreachable!');
              });
          })));

        it('should be able to retrieve and merge settings `in series`',
          async(() => {
            const mainLoader = new ConfigStaticLoader(testSettingsMain);
            const localLoader = new ConfigStaticLoader(testSettingsLocal);
            const envLoader = new ConfigStaticLoader(testSettingsEnv);

            const configFactory = () => new ConfigMergeLoader([mainLoader, localLoader])
              .next((res: any) => envLoader);

            testModuleConfig({
              provide: ConfigLoader,
              useFactory: (configFactory)
            });

            const injector = getTestBed();
            const config = injector.get(ConfigService);

            config.loader.loadSettings()
              .then((res: any) => {
                expect(res).toEqual(testSettingsMerged);
              });
          }));

        it('should be able to retrieve and merge settings `in series` w/data from parent `loaders`',
          async(() => {
            const envLoader = new ConfigStaticLoader(testSettingsEnv);

            const configFactory = () => new ConfigMergeLoader([envLoader])
              .next((res: any) => new ConfigStaticLoader({env: res}));

            testModuleConfig({
              provide: ConfigLoader,
              useFactory: (configFactory)
            });

            const injector = getTestBed();
            const config = injector.get(ConfigService);

            const expectedSettings = {
              setting4: 'value4',
              nested: {
                k2: 'v2 from env/test.json',
                k3: 'v3'
              },
              env: {
                setting4: 'value4',
                nested: {
                  k2: 'v2 from env/test.json',
                  k3: 'v3'
                }
              }
            };

            config.loader.loadSettings()
              .then((res: any) => {
                expect(res).toEqual(expectedSettings);
              });
          }));
      });
  });
