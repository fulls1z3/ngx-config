// angular
import { HttpClient } from '@angular/common/http';

// libs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ConfigLoader } from '@ngx-config/core';

export class ConfigHttpLoader implements ConfigLoader {
  constructor(private readonly http: HttpClient,
              private readonly endpoint: string = '/config.json') {
  }

  loadSettings(): any {
    return this.http.get(this.endpoint)
      .toPromise()
      .then((settings: any) => settings)
      .catch(() => Promise.reject('Endpoint unreachable!'));
  }
}
