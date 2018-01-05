// angular
import { HttpClient } from '@angular/common/http';

// libs
import { ConfigLoader } from '@ngx-config/core';

export class ConfigHttpLoader implements ConfigLoader {
  constructor(private readonly http: HttpClient,
              private readonly endpoint: string = '/config.json') {
  }

  loadSettings(): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.endpoint)
        .subscribe((res: any) => resolve(res), () => reject('Endpoint unreachable!'));
    });
  }
}
