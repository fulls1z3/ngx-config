import { inject, waitForAsync } from '@angular/core/testing';

import { ConfigLoader, ConfigService, ConfigStaticLoader } from '../src';

import { testModuleConfig, testSettings } from './common';

describe('@ngx-config/core:', () => {
  beforeEach(() => {
    const configFactory = () => new ConfigStaticLoader(testSettings);

    testModuleConfig({
      provide: ConfigLoader,
      useFactory: configFactory,
    });
  });

  describe('ConfigService', () => {
    it('is defined', inject([ConfigService], (config: ConfigService) => {
      expect(ConfigService).toBeDefined();
      expect(config).toBeDefined();
      expect(config instanceof ConfigService).toBeTruthy();
    }));

    it('should be able to get all settings', inject([ConfigService], (config: ConfigService) => {
      config.loader.loadSettings().then(() => {
        expect(config.getSettings()).toEqual(testSettings);
        expect(config.getSettings('')).toEqual(testSettings);
        expect(config.getSettings([])).toEqual(testSettings);
      });
    }));

    it(
      'should be able to get setting(s) using `key`',
      waitForAsync(
        inject([ConfigService], (config: ConfigService) => {
          config.loader.loadSettings().then(() => {
            expect(config.getSettings('system')).toEqual({
              applicationName: 'Mighty Mouse',
              applicationUrl: 'http://localhost:8000',
            });

            expect(config.getSettings(['system', 'applicationName'])).toEqual('Mighty Mouse');
            expect(config.getSettings('system.applicationName')).toEqual('Mighty Mouse');

            expect(config.getSettings(['system', 'applicationUrl'])).toEqual('http://localhost:8000');
            expect(config.getSettings('system.applicationUrl')).toEqual('http://localhost:8000');

            expect(config.getSettings('i18n')).toEqual({
              locale: 'en',
            });

            expect(config.getSettings(['i18n', 'locale'])).toEqual('en');
            expect(config.getSettings('i18n.locale')).toEqual('en');
          });
        })
      )
    );

    it(
      'should be able to get setting(s) using `key` (zero value)',
      waitForAsync(
        inject([ConfigService], (config: ConfigService) => {
          config.loader.loadSettings().then(() => {
            expect(config.getSettings('falsy.zero')).toEqual(0);
          });
        })
      )
    );

    it(
      'should be able to get setting(s) using `key` (null value)',
      waitForAsync(
        inject([ConfigService], (config: ConfigService) => {
          config.loader.loadSettings().then(() => {
            expect(config.getSettings('falsy.null')).toBeNull();
          });
        })
      )
    );

    it(
      'should be able to get setting(s) using `key` (empty string)',
      waitForAsync(
        inject([ConfigService], (config: ConfigService) => {
          config.loader.loadSettings().then(() => {
            expect(config.getSettings('falsy.emptyString')).toEqual('');
          });
        })
      )
    );

    it(
      'should be able to get `default value` w/invalid `key`',
      waitForAsync(
        inject([ConfigService], (config: ConfigService) => {
          config.loader.loadSettings().then(() => {
            expect(config.getSettings('layout', 'default')).toEqual('default');
          });
        })
      )
    );

    it(
      'should throw if you provide an invalid `key` w/o `default value`',
      waitForAsync(
        inject([ConfigService], (config: ConfigService) => {
          config.loader.loadSettings().then(() => {
            expect(() => config.getSettings('layout')).toThrowError('No setting found with the specified key [layout]!');
          });
        })
      )
    );
  });
});
