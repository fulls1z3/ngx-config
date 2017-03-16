// angular
import { Http } from '@angular/http';

// libs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

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

export class ConfigMergedLoader implements ConfigLoader {
  constructor(private readonly http: Http,
              private readonly paths: string[] = ['/config.json', '/config.local.json']) {
  }

  loadSettings(): any {
    const errorIfEmpty = (source: Observable<any>) => {
      return source.isEmpty()
        .mergeMap((empty: boolean) => (empty) ? Observable.throw(new Error('empty')) : Observable.empty());
    };
    const mergeWith = (object: any, source: any[]) => {
      return _.mergeWith(object, source, (objValue: any, srcValue: any) => {
        if (_.isArray(objValue)) {
          return srcValue;
        }
      });
    };
    const jsons = Observable.onErrorResumeNext(this.paths.map(path => this.http.get(path)))
      .map((res: any) => res.json())
      .filter((x: any) => x !== null)
      .share();
    return jsons.merge(errorIfEmpty(jsons))
      .reduce((x: any, y: any) => mergeWith(x, y), {})
      .toPromise()
      .then((settings: any) => settings)
      .catch(() => Promise.reject('Config was not loaded!'));
  }
}
