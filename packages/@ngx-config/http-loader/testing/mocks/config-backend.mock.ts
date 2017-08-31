// angular
import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export const testSettings = {
  system: {
    applicationName: 'Mighty Mouse',
    applicationUrl: 'http://localhost:8000'
  },
  i18n: {
    locale: 'en'
  }
};

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions): Http {
  backend.connections
    .subscribe((connection: MockConnection) => {
      if ((connection.request.url.endsWith('/api/settings')
        || connection.request.url.endsWith('/config.json')
        && connection.request.method === RequestMethod.Get))
          connection.mockRespond(new Response(
            new ResponseOptions({
              status: 200,
              body: testSettings
            })
          ));
      else
        connection.mockError(new Error('500'));
    });

  return new Http(backend, options);
}
