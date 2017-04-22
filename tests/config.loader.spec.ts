// angular
import { getTestBed } from '@angular/core/testing';

// module
import { ConfigLoader, ConfigStaticLoader, ConfigService } from '../index';
import { testModuleConfig } from './index.spec';

describe('@ngx-config/core:',
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
  });
