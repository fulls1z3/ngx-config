// angular
import { Http } from '@angular/http';

// libs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ConfigLoader } from '@ngx-config/core';

export class ConfigHttpLoader implements ConfigLoader {
  constructor(private readonly http: Http,
              private readonly endpoint: string = '/config.json') {
  }

  loadSettings(): any {
    return this.http.get(this.endpoint)
      .map((res: any) => res.json())
      .toPromise()
      .then((settings: any) => settings)
      .catch(() => Promise.reject('Endpoint unreachable!'));
  }
}
