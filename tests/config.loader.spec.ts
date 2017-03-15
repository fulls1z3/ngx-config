// angular
import { async, getTestBed, inject } from '@angular/core/testing';
import { Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

// module
import { ConfigLoader, ConfigStaticLoader, ConfigHttpLoader, ConfigMergedLoader, ConfigService } from '../index';
import { testSettings, testModuleConfig } from './index.spec';

// libs
import * as _ from 'lodash';

const mockBackendResponse = (connection: MockConnection, response: any) => {
  connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

const mockBackendError = (connection: MockConnection, error: string) => {
  connection.mockError(new Error(error));
};

const mockBackendRoute = (connection: MockConnection, routes: any) => {
  const response = routes[connection.request.url];
  if (typeof response !== undefined) {
    mockBackendResponse(connection, response);
  } else {
    mockBackendError(connection, '404');
  }
};

describe('@nglibs/config:',
  () => {
    beforeEach(() => {
      const configFactory = () => new ConfigStaticLoader();

      testModuleConfig({
        provide: ConfigLoader,
        useFactory: (configFactory)
      });
    });

    describe('ConfigLoader',
      () => {
        it('should not return any settings unless provided',
          () => {
            const loader = new ConfigStaticLoader();

            loader.loadSettings().then((res: any) => {
              expect(res).toBeUndefined();
            });
          });

        it('should be able to provide `ConfigStaticLoader`',
          () => {
            const injector = getTestBed();
            const config = injector.get(ConfigService);

            expect(ConfigStaticLoader).toBeDefined();
            expect(config.loader).toBeDefined();
            expect(config.loader instanceof ConfigStaticLoader).toBeTruthy();
          });

        it('should be able to provide `ConfigHttpLoader`',
          () => {
            const configFactory = (http: Http) => new ConfigHttpLoader(http);

            testModuleConfig({
              provide: ConfigLoader,
              useFactory: (configFactory),
              deps: [Http]
            });

            const injector = getTestBed();
            const config = injector.get(ConfigService);

            expect(ConfigHttpLoader).toBeDefined();
            expect(config.loader).toBeDefined();
            expect(config.loader instanceof ConfigHttpLoader).toBeTruthy();
          });

        it('should be able to provide `ConfigMergedLoader`',
          () => {
            const configFactory = (http: Http) => new ConfigMergedLoader(http);

            testModuleConfig({
              provide: ConfigLoader,
              useFactory: (configFactory),
              deps: [Http]
            });

            const injector = getTestBed();
            const config = injector.get(ConfigService);

            expect(ConfigMergedLoader).toBeDefined();
            expect(config.loader).toBeDefined();
            expect(config.loader instanceof ConfigMergedLoader).toBeTruthy();
          });

        it('should be able to provide any `ConfigLoader`',
          () => {
            class CustomLoader implements ConfigLoader {
              loadSettings(): any {
                return Promise.resolve({});
              }
            }

            testModuleConfig({
              provide: ConfigLoader,
              useClass: CustomLoader
            });

            const injector = getTestBed();
            const config = injector.get(ConfigService);

            expect(CustomLoader).toBeDefined();
            expect(config.loader).toBeDefined();
            expect(config.loader instanceof CustomLoader).toBeTruthy();
          });
      });

    describe('ConfigHttpLoader',
      () => {
        beforeEach(() => {
          const configFactory = (http: Http) => new ConfigHttpLoader(http, '/api/get-settings');

          testModuleConfig({
            provide: ConfigLoader,
            useFactory: (configFactory),
            deps: [Http]
          });
        });

        it('should be able to retrieve settings from the specified `path`',
          async(inject([MockBackend, ConfigService],
            (backend: MockBackend, config: ConfigService) => {
              // mock response
              backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testSettings));

              config.loader.loadSettings()
                .then((res: any) => {
                  expect(res).toEqual(testSettings);
                });
            })));

        it('should throw w/o a valid `path`',
          async(inject([MockBackend, ConfigService],
            (backend: MockBackend, config: ConfigService) => {
              // mock error
              backend.connections.subscribe((c: MockConnection) => mockBackendError(c, '500'));

              // this will produce error at the backend
              config.loader.loadSettings()
                .catch((res: any) => {
                  expect(res).toEqual('Endpoint unreachable!');
                });
            })));
      });

    describe('ConfigMergedLoader',
      () => {
        const defaultPaths = ['/config.json', '/config.local.json', '/env/test.json'];
        const defaultRoutes = {
          '/config.json': {
            'setting1': 'value1',
            'setting2': 'from config.json',
            'arr': [1, 2, 3],
            'nested': {
              'k1': 'v1',
              'k2': 'v2 from config.json'
            }
          },
          '/config.local.json': {
            'setting2': 'from config.local.json',
            'setting3': 'value3',
            'arr': [4, 5]
          },
          '/env/test.json': {
            'setting4': 'value4',
            'nested': {
              'k2': 'v2 from env/test.json',
              'k3': 'v3'
            }
          }
        };
        const defaultMergedSettings = {
          'setting1': 'value1',
          'setting2': 'from config.local.json',
          'setting3': 'value3',
          'setting4': 'value4',
          'arr': [4, 5],
          'nested': {
            'k1': 'v1',
            'k2': 'v2 from env/test.json',
            'k3': 'v3'
          }
        };

        beforeEach(() => {
          const configFactory = (http: Http) => new ConfigMergedLoader(http, defaultPaths);

          testModuleConfig({
            provide: ConfigLoader,
            useFactory: (configFactory),
            deps: [Http]
          });
        });

        it('should be able to retrieve and merge settings from the specified `paths`',
          async(inject([MockBackend, ConfigService],
            (backend: MockBackend, config: ConfigService) => {
              // mock response
              backend.connections.subscribe((c: MockConnection) => mockBackendRoute(c, defaultRoutes));

              config.loader.loadSettings()
                .then((res: any) => {
                  expect(res).toEqual(defaultMergedSettings);
                })
                .catch(() => fail('unreached'));
            })));

        it('should allow some of files in `paths` to be unavailable',
          async(inject([MockBackend, ConfigService],
            (backend: MockBackend, config: ConfigService) => {
              // make '/config.local.json' unavailable
              let routesCopy = _.cloneDeep(defaultRoutes);
              delete routesCopy['/config.local.json'];
              const settings = {
                'setting1': 'value1',
                'setting2': 'from config.json',
                'setting4': 'value4',
                'arr': [1, 2, 3],
                'nested': {
                  'k1': 'v1',
                  'k2': 'v2 from env/test.json',
                  'k3': 'v3'
                }
              };

              // mock response
              backend.connections.subscribe((c: MockConnection) => mockBackendRoute(c, routesCopy));

              config.loader.loadSettings()
                .then((res: any) => {
                  expect(res).toEqual(settings);
                })
                .catch(() => fail('unreached'));
            })));

        it('should throw if all files in `paths` were unavailable',
          async(inject([MockBackend, ConfigService],
            (backend: MockBackend, config: ConfigService) => {
              // mock response
              backend.connections.subscribe((c: MockConnection) => mockBackendRoute(c, {}));

              config.loader.loadSettings()
                .then(() => fail('unreached'))
                .catch((res: any) => {
                  expect(res).toEqual('Config was not loaded!');
                });
            })));
      });
  });
