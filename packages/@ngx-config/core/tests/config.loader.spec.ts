// angular
import { TestBed } from '@angular/core/testing';

// module
import { ConfigLoader, ConfigService, ConfigStaticLoader } from '../index';
import { testModuleConfig } from './common';

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
            const config = TestBed.get(ConfigService);

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

            const config = TestBed.get(ConfigService);

            expect(CustomLoader).toBeDefined();
            expect(config.loader).toBeDefined();
            expect(config.loader instanceof CustomLoader).toBeTruthy();
          });
      });
  });
