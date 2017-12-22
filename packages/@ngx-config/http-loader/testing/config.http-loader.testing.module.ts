// angular
import { NgModule } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { MockBackend } from '@angular/http/testing';

// module
import { fakeBackendFactory } from './mocks/config-backend.mock';

export * from './mocks/config-backend.mock';

@NgModule({
  providers: [
    {
      provide: HttpClient,
      useFactory: fakeBackendFactory,
      deps: [
        MockBackend,
        BaseRequestOptions
      ]
    },
    MockBackend,
    BaseRequestOptions
  ]
})
export class ConfigHttpLoaderTestingModule {
}
