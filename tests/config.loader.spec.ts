// angular
import { async, getTestBed, inject } from '@angular/core/testing';
import { Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

// libs
import * as _ from 'lodash';

// module
import { ConfigLoader, ConfigStaticLoader, ConfigHttpLoader, ConfigMergedHttpLoader, ConfigService } from '../index';
import { testSettings, testPaths, testResponse, testMergedSettings, testModuleConfig } from './index.spec';

const mockBackendResponse = (connection: MockConnection, response: any) => {
  const res = response[connection.request.url];

  connection.mockRespond(new Response(new ResponseOptions({body: res})));
};

const mockBackendError = (connection: MockConnection, error: string) => {
  connection.mockError(new Error(error));
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

        it('should be able to provide `ConfigMergedHttpLoader`',
          () => {
            const configFactory = (http: Http) => new ConfigMergedHttpLoader(http);

            testModuleConfig({
              provide: ConfigLoader,
              useFactory: (configFactory),
              deps: [Http]
            });

            const injector = getTestBed();
            const config = injector.get(ConfigService);

            expect(ConfigMergedHttpLoader).toBeDefined();
            expect(config.loader).toBeDefined();
            expect(config.loader instanceof ConfigMergedHttpLoader).toBeTruthy();
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
              backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testResponse));

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

    describe('ConfigMergedHttpLoader',
      () => {
        beforeEach(() => {
          const configFactory = (http: Http) => new ConfigMergedHttpLoader(http, testPaths);

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
              backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testResponse));

              config.loader.loadSettings()
                .then((res: any) => {
                  expect(res).toEqual(testMergedSettings);
                });
            })));

        it('should allow some of files in `paths` to be unavailable',
          async(inject([MockBackend, ConfigService],
            (backend: MockBackend, config: ConfigService) => {
              // make '/config.local.json' unavailable
              let response = _.cloneDeep(testResponse);
              delete response['/config.local.json'];

              const expectedSettings = {
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
              backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, response));

              config.loader.loadSettings()
                .then((res: any) => {
                  expect(res).toEqual(expectedSettings);
                });
            })));

        it('should throw if all files in `paths` were unavailable',
          async(inject([MockBackend, ConfigService],
            (backend: MockBackend, config: ConfigService) => {
              // mock response
              backend.connections.subscribe((c: MockConnection) => mockBackendError(c, '500'));

              config.loader.loadSettings()
                .catch((res: any) => {
                  expect(res).toEqual('Endpoint unreachable!');
                });
            })));
      });
  });
