// libs
import { Observable } from 'rxjs/Observable';
import { filter, isEmpty, merge, mergeMap, reduce, share } from 'rxjs/operators';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/onErrorResumeNext';

import * as _ from 'lodash';
import { ConfigLoader, ConfigStaticLoader } from '@ngx-config/core';

const errorIfEmpty = (source: Observable<any>): Observable<any> => {
  return source
    .pipe(
      isEmpty(),
      mergeMap((empty: boolean) => empty
        ? Observable.throw(new Error('No setting found at the specified loader!'))
        : new EmptyObservable())
    );
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

    const mergedSettings = Observable.onErrorResumeNext(loaders
      .map((loader: ConfigLoader) => Observable.fromPromise(loader.loadSettings()))
    )
      .pipe(
        filter((res: any) => res),
        share()
      );

    return new Promise((resolve, reject) => {
      mergedSettings
        .pipe(
          merge(errorIfEmpty(mergedSettings)),
          merge(mergedSettings),
          reduce((merged: any, current: any) => mergeWith(merged, current), {})
        )
        .subscribe((res: any) => resolve(res), () => reject('Loaders unreachable!'));
    });
  }
}
