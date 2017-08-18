// angular
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// module
import { ConfigModule } from '../index';

export const testSettings = {
  system: {
    applicationName: 'Mighty Mouse',
    applicationUrl: 'http://localhost:8000'
  },
  i18n: {
    locale: 'en'
  },
  falsy: {
    zero: 0,
    // tslint:disable-next-line
    null: null as any,
    emptyString: ''
  }
};

// test module configuration for each test
export const testModuleConfig = (moduleOptions?: any) => {
  // reset the test environment before initializing it.
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
    .configureTestingModule({
      imports: [
        ConfigModule.forRoot(moduleOptions)
      ]
    });
};
