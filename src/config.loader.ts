// angular
import { Http } from '@angular/http';

// libs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export abstract class ConfigLoader {
  abstract loadSettings(): any;
}

export class ConfigStaticLoader implements ConfigLoader {
  constructor(private readonly settings?: any) {
  }

  loadSettings(): any {
    return Promise.resolve(this.settings);
  }
}

export class ConfigHttpLoader implements ConfigLoader {
  constructor(private readonly http: Http,
              private readonly path: string = '/config.json') {
  }

  loadSettings(): any {
    return this.http.get(this.path)
      .map((res: any) => res.json())
      .toPromise()
      .then((settings: any) => settings)
      .catch(() => Promise.reject('Endpoint unreachable!'));
  }
}
