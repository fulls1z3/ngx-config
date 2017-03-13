// angular
import { async, getTestBed, inject } from '@angular/core/testing';
import { Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

// module
import { ConfigLoader, ConfigStaticLoader, ConfigHttpLoader, ConfigService } from '../index';
import { testSettings, testModuleConfig } from './index.spec';

const mockBackendResponse = (connection: MockConnection, response: any) => {
  connection.mockRespond(new Response(new ResponseOptions({body: response})));
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
  });
