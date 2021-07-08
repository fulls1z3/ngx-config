import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ConfigLoader, ConfigModule, ConfigService } from '@ngx-config/core';

import { ConfigHttpLoader } from '../src';

const testSettings = {
  system: {
    applicationName: 'Mighty Mouse',
    applicationUrl: 'http://localhost:8000'
  },
  i18n: {
    locale: 'en'
  }
};

const testModuleConfig = (moduleOptions?: any) => {
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting()).configureTestingModule({
    imports: [HttpClientTestingModule, ConfigModule.forRoot(moduleOptions)]
  });
};

describe('@ngx-config/http-loader:', () => {
  describe('ConfigHttpLoader', () => {
    it('should be able to provide `ConfigHttpLoader`', () => {
      const configFactory = (http: HttpClient) => new ConfigHttpLoader(http);

      testModuleConfig({
        provide: ConfigLoader,
        useFactory: configFactory,
        deps: [HttpClient]
      });

      const config = TestBed.get(ConfigService);

      expect(ConfigHttpLoader).toBeDefined();
      expect(config.loader).toBeDefined();
      expect(config.loader instanceof ConfigHttpLoader).toBeTruthy();

      const httpMock = TestBed.get(HttpTestingController);
      httpMock
        .expectOne({
          method: 'GET',
          url: '/config.json'
        })
        .flush(testSettings);
      httpMock.verify();
    });
  });

  it('should be able to retrieve settings from the specified `endpoint`', async(() => {
    const configFactory = (http: HttpClient) => new ConfigHttpLoader(http, '/api/settings');

    testModuleConfig({
      provide: ConfigLoader,
      useFactory: configFactory,
      deps: [HttpClient]
    });

    const config = TestBed.get(ConfigService);

    config.loader.loadSettings().then((res: any) => {
      expect(res).toEqual(testSettings);
    });

    const httpMock = TestBed.get(HttpTestingController);
    const reqs = httpMock.match('/api/settings');

    for (const req of reqs) {
      req.flush(testSettings);
    }

    httpMock.verify();
  }));

  it('should throw w/o a valid `endpoint`', (done: jest.DoneCallback) => {
    const configFactory = (http: HttpClient) => new ConfigHttpLoader(http, '/api/wrong-settings');

    testModuleConfig({
      provide: ConfigLoader,
      useFactory: configFactory,
      deps: [HttpClient]
    });

    const config = TestBed.get(ConfigService);

    config.loader.loadSettings().catch((err: any) => {
      expect(err).toEqual('Endpoint unreachable!');
      done();
    });

    const httpMock = TestBed.get(HttpTestingController);
    const reqs = httpMock.match('/api/wrong-settings');

    for (const req of reqs) {
      req.flush(
        {},
        {
          status: 500,
          statusText: ''
        }
      );
    }

    httpMock.verify();
  });
});
