import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import { ConfigModule } from '../src';

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
    null: null as any,
    emptyString: ''
  }
};

export const testModuleConfig = (moduleOptions?: any) => {
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting()).configureTestingModule({
    imports: [ConfigModule.forRoot(moduleOptions)]
  });
};
