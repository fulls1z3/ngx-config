import { inject } from '@angular/core/testing';

import { ConfigLoader, ConfigPipe, ConfigService, ConfigStaticLoader } from '../src';

import { testModuleConfig, testSettings } from './common';

describe('@ngx-config/core:', () => {
  beforeEach(() => {
    const configFactory = () => new ConfigStaticLoader(testSettings);

    testModuleConfig({
      provide: ConfigLoader,
      useFactory: configFactory
    });
  });

  describe('ConfigPipe', () => {
    it('is defined', inject([ConfigService], (config: ConfigService) => {
      const pipe = new ConfigPipe(config);

      expect(ConfigPipe).toBeDefined();
      expect(pipe).toBeDefined();
      expect(pipe instanceof ConfigPipe).toBeTruthy();
    }));

    it('should be able to get setting(s) using `key`', inject([ConfigService], (config: ConfigService) => {
      config.loader.loadSettings().then(() => {
        const pipe = new ConfigPipe(config);

        let setting = pipe.transform(['system', 'applicationName']);
        expect(setting).toEqual('Mighty Mouse');

        setting = pipe.transform('system.applicationUrl');
        expect(setting).toEqual('http://localhost:8000');
      });
    }));

    it('should throw if you provide an invalid `key` w/o `default value`', inject(
      [ConfigService],
      (config: ConfigService) => {
        config.loader.loadSettings().then(() => {
          const pipe = new ConfigPipe(config);

          expect(() => pipe.transform('layout')).toThrowError('No setting found with the specified key [layout]!');
        });
      }
    ));
  });
});
