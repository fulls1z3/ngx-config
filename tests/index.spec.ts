// angular
import { TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// module
import { ConfigModule } from '../index';

export const testPaths = ['/config.json', '/config.local.json', '/env/test.json'];

export const testSettings = {
  'system': {
    'applicationName': 'Mighty Mouse',
    'applicationUrl': 'http://localhost:8000'
  },
  'i18n': {
    'locale': 'en'
  }
};

export const testResponse = {
  '/api/get-settings': testSettings,
  '/config.json': {
    'setting1': 'value1',
    'setting2': 'from config.json',
    'arr': [1, 2, 3],
    'nested': {
      'k1': 'v1',
      'k2': 'v2 from config.json'
    }
  },
  '/config.local.json': {
    'setting2': 'from config.local.json',
    'setting3': 'value3',
    'arr': [4, 5]
  },
  '/env/test.json': {
    'setting4': 'value4',
    'nested': {
      'k2': 'v2 from env/test.json',
      'k3': 'v3'
    }
  }
};

export const testMergedSettings = {
  'setting1': 'value1',
  'setting2': 'from config.local.json',
  'setting3': 'value3',
  'setting4': 'value4',
  'arr': [4, 5],
  'nested': {
    'k1': 'v1',
    'k2': 'v2 from env/test.json',
    'k3': 'v3'
  }
};

// test module configuration for each test
export const testModuleConfig = (moduleOptions?: any) => {
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
