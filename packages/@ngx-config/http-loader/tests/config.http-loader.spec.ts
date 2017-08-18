// angular
import { async, getTestBed, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// libs
import { ConfigLoader, ConfigModule, ConfigService } from '@ngx-config/core';

// module
import { ConfigHttpLoader } from '../index';

const testSettings = {
  system: {
    applicationName: 'Mighty Mouse',
    applicationUrl: 'http://localhost:8000'
  },
  i18n: {
    locale: 'en'
  }
};

const testResponse = {
  '/config.json': testSettings,
  '/api/get-settings': testSettings
};

const mockBackendResponse = (connection: MockConnection, response: any) => {
  const res = response[connection.request.url];

  connection.mockRespond(new Response(new ResponseOptions({body: res})));
};

const mockBackendError = (connection: MockConnection, error: string) => {
  connection.mockError(new Error(error));
};

// test module configuration for each test
const testModuleConfig = (moduleOptions?: any) => {
  // reset the test environment before initializing it.
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
    .configureTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot(moduleOptions)
      ],
      providers: [
        {
          provide: Http,
          useFactory: (mockBackend: MockBackend, options: BaseRequestOptions) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions
      ]
    });
};

describe('@ngx-config/http-loader:',
  () => {
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

        it('should be able to retrieve settings from the specified `endpoint`',
          async(inject([MockBackend, ConfigService],
            (backend: MockBackend, config: ConfigService) => {
              // mock response
              backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testResponse));

              config.loader.loadSettings()
                .then((res: any) => {
                  expect(res).toEqual(testSettings);
                });
            })));

        it('should throw w/o a valid `endpoint`',
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
