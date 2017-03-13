// angular
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

// module
import { ConfigModule } from '../index';

export const testSettings = {
  'system': {
    'applicationName': 'Mighty Mouse',
    'applicationUrl': 'http://localhost:8000'
  },
  'i18n': {
    'locale': 'en'
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
