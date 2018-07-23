// libs
import { EMPTY, from as fromObservable, merge, Observable, onErrorResumeNext, throwError } from 'rxjs';
import { filter, isEmpty, mergeMap, reduce, share } from 'rxjs/operators';

import { mergeWith as _mergeWith } from 'lodash/fp';
import { ConfigLoader, ConfigStaticLoader } from '@ngx-config/core';

const errorIfEmpty = (source: Observable<any>): Observable<any> => {
  return source
    .pipe(
      isEmpty(),
      mergeMap((empty: boolean) => empty
        ? throwError(new Error('No setting found at the specified loader!'))
        : EMPTY)
    );
};

const mergeWith = (object: any) => (source: Array<any>): any => {
  return _mergeWith((objValue: any, srcValue: any) => {
    if (Array.isArray(objValue))
      return srcValue;
  })(object)(source);
};

const mergeSeries = (merged: any, current: Promise<any>): any => {
  return current.then(mergeWith(merged));
};

export class ConfigMergeLoader implements ConfigLoader {
  private nextLoader: Function;

  constructor(private readonly loaders: Array<ConfigLoader> = []) {
  }

  loadSettings(): any {
    if (this.nextLoader)
      return this.mergeParallel()
        .then((res: any) => mergeSeries(res, this.nextLoader(res)
          .loadSettings()));

    return this.mergeParallel();
  }

  next(loader: Function): any {
    this.nextLoader = loader;

    return this;
  }

  private mergeParallel(): Promise<any> {
    const loaders: Array<ConfigLoader> = [new ConfigStaticLoader(), ...this.loaders];

    const mergedSettings = onErrorResumeNext(loaders
      .map((loader: ConfigLoader) => fromObservable(loader.loadSettings()))
    )
      .pipe(
        filter((res: any) => res),
        share()
      );

    return new Promise((resolve, reject) => {
      merge(mergedSettings, errorIfEmpty(mergedSettings), mergedSettings)
        .pipe(
          reduce((merged: any, current: any) => mergeWith(merged)(current), {})
        )
        .subscribe((res: any) => resolve(res), () => reject('Loaders unreachable!'));
    });
  }
}
