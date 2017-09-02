// angular
import { async, TestBed } from '@angular/core/testing';
import { Http } from '@angular/http';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// libs
import { ConfigLoader, ConfigModule, ConfigService } from '@ngx-config/core';

// module
import { ConfigHttpLoaderTestingModule, testSettings } from '../testing/config.http-loader.testing.module';
import { ConfigHttpLoader } from '../index';

const testModuleConfig = (moduleOptions?: any) => {
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
    .configureTestingModule({
      imports: [
        ConfigModule.forRoot(moduleOptions),
        ConfigHttpLoaderTestingModule
      ]
    });
};

describe('@ngx-config/http-loader:',
  () => {
    describe('ConfigHttpLoader',
      () => {
        it('should be able to provide `ConfigHttpLoader`',
          () => {
            const configFactory = (http: Http) => new ConfigHttpLoader(http);

            testModuleConfig({
              provide: ConfigLoader,
              useFactory: (configFactory),
              deps: [Http]
            });

            const config = TestBed.get(ConfigService);

            expect(ConfigHttpLoader).toBeDefined();
            expect(config.loader).toBeDefined();
            expect(config.loader instanceof ConfigHttpLoader).toBeTruthy();
          });
      });

    it('should be able to retrieve settings from the specified `endpoint`',
      async(() => {
        const configFactory = (http: Http) => new ConfigHttpLoader(http, '/api/settings');

        testModuleConfig({
          provide: ConfigLoader,
          useFactory: (configFactory),
          deps: [Http]
        });

        const config = TestBed.get(ConfigService);

        config.loader.loadSettings()
          .then((res: any) => {
            expect(res).toEqual(testSettings);
          });
      }));

    it('should throw w/o a valid `endpoint`',
      async () => {
        const configFactory = (http: Http) => new ConfigHttpLoader(http, '/api/wrong-settings');

        testModuleConfig({
          provide: ConfigLoader,
          useFactory: (configFactory),
          deps: [Http]
        });

        expect.assertions(1);

        try {
          const config = TestBed.get(ConfigService);
          await config.loader.loadSettings();
        } catch (e) {
          expect(e).toEqual('Endpoint unreachable!');
        }
      });
  });
