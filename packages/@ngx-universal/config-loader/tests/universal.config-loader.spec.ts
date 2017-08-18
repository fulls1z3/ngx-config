// angular
import { PLATFORM_ID } from '@angular/core';
import { getTestBed, inject, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// libs
import { ConfigLoader, ConfigModule, ConfigService, ConfigStaticLoader } from '@ngx-config/core';

// module
import { UniversalConfigLoader } from '../index';

const testSettings = {
  system: {
    applicationName: 'Mighty Mouse',
    applicationUrl: 'http://localhost:8000'
  },
  i18n: {
    locale: 'en'
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

describe('@ngx-universal/config-loader:',
  () => {
    it('should be able to provide `UniversalConfigLoader`',
      () => {
        const serverLoader = new ConfigStaticLoader(testSettings);
        const browserLoader = new ConfigStaticLoader(testSettings);
        const configFactory = (platformId: any) => new UniversalConfigLoader(platformId, serverLoader, browserLoader);

        testModuleConfig({
          provide: ConfigLoader,
          useFactory: (configFactory),
          deps: [PLATFORM_ID]
        });

        const injector = getTestBed();
        const config = injector.get(ConfigService);

        expect(UniversalConfigLoader).toBeDefined();
        expect(config.loader).toBeDefined();
        expect(config.loader instanceof UniversalConfigLoader).toBeTruthy();
      });

    describe('UniversalConfigLoader on `browser` platform',
      () => {
        beforeEach(() => {
          const serverLoader = new ConfigStaticLoader(testSettings);
          const browserLoader = new ConfigStaticLoader(testSettings);
          const configFactory = () => new UniversalConfigLoader('browser', serverLoader, browserLoader);

          testModuleConfig({
            provide: ConfigLoader,
            useFactory: (configFactory)
          });
        });

        it('should be able to retrieve settings',
          inject([ConfigService],
            (config: ConfigService) => {
              config.loader.loadSettings()
                .then((res: any) => {
                  expect(res).toEqual(testSettings);
                });
            }));
      });

    describe('UniversalConfigLoader on `server` platform',
      () => {
        beforeEach(() => {
          const serverLoader = new ConfigStaticLoader(testSettings);
          const browserLoader = new ConfigStaticLoader(testSettings);
          const configFactory = () => new UniversalConfigLoader('server', serverLoader, browserLoader);

          testModuleConfig({
            provide: ConfigLoader,
            useFactory: (configFactory)
          });
        });

        it('should be able to retrieve settings',
          inject([ConfigService],
            (config: ConfigService) => {
              config.loader.loadSettings()
                .then((res: any) => {
                  expect(res).toEqual(testSettings);
                });
            }));
      });
  });
