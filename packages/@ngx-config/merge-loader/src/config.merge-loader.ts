// libs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/onErrorResumeNext';
import 'rxjs/add/operator/isEmpty';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';
import { ConfigLoader, ConfigStaticLoader } from '@ngx-config/core';

const errorIfEmpty = (source: Observable<any>): Observable<any> => {
  return source.isEmpty()
    .mergeMap((isEmpty: boolean) => isEmpty
      ? Observable.throw(new Error('No setting found at the specified loader!'))
      : Observable.empty());
};

const mergeWith = (object: any, source: Array<any>): any => {
  return _.mergeWith(object, source, (objValue: any, srcValue: any) => {
    if (Array.isArray(objValue))
      return srcValue;
  });
};

const mergeSeries = (merged: any, current: Promise<any>): any => {
  return current.then((res: any) => mergeWith(merged, res));
};

export class ConfigMergeLoader implements ConfigLoader {
  private nextLoader: Function;

  constructor(private readonly loaders: Array<ConfigLoader> = []) {
  }

  loadSettings(): any {
    if (this.nextLoader)
      return this.mergeParallel()
        .then((res: any) => mergeSeries(res, this.nextLoader(res).loadSettings()));

    return this.mergeParallel();
  }

  next(loader: Function): any {
    this.nextLoader = loader;

    return this;
  }

  private mergeParallel(): Promise<any> {
    const loaders: Array<ConfigLoader> = [new ConfigStaticLoader(), ...this.loaders];

    const mergedSettings = Observable.onErrorResumeNext(loaders.map((loader: ConfigLoader) => loader.loadSettings()))
      .filter((settings: any) => settings)
      .share();

    return mergedSettings.merge(errorIfEmpty(mergedSettings))
      .reduce((merged: any, current: any) => mergeWith(merged, current), {})
      .toPromise()
      .then((settings: any) => settings)
      .catch(() => Promise.reject('Loaders unreachable!'));
  }
}
