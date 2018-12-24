import { Injectable } from '@angular/core';

import { ConfigLoader } from './config.loader';

@Injectable()
export class ConfigService {
  protected settings: any;

  constructor(readonly loader: ConfigLoader) {}

  init(): any {
    return this.loader.loadSettings().then((res: any) => (this.settings = res));
  }

  getSettings<T = any>(key?: string | Array<string>, defaultValue?: any): T {
    if (!key || (Array.isArray(key) && !key[0])) {
      return this.settings;
    }

    const paths = !Array.isArray(key) ? key.split('.') : key;

    let result = paths.reduce((acc: any, current: string) => acc && acc[current], this.settings);

    if (result === undefined) {
      result = defaultValue;

      if (result === undefined) {
        throw new Error(`No setting found with the specified key [${paths.join('/')}]!`);
      }
    }

    return result;
  }
}
