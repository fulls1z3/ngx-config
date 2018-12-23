// angular
import { Injectable } from '@angular/core';

// module
import { ConfigLoader } from './config.loader';

@Injectable()
export class ConfigService {
  protected settings: any;
  private onLoadSettings: () => void;
  readonly whenConfigLoaded = new Promise<void>(resolve => this.onLoadSettings = resolve);

  constructor(readonly loader: ConfigLoader) {
  }

  init(): any {
    return this.loader.loadSettings()
      .then((res: any) => {
        this.settings = res;
        this.onLoadSettings();
      });
  }

  getSettings<T = any>(key?: string | Array<string>, defaultValue?: any): T {
    if (!key || (Array.isArray(key) && !key[0]))
      return this.settings;

    if (!Array.isArray(key))
      key = key.split('.');

    let result = key
      .reduce((acc: any, current: string) => acc && acc[current], this.settings);

    if (result === undefined) {
      result = defaultValue;

      if (result === undefined)
        throw new Error(`No setting found with the specified key [${key.join('/')}]!`);
    }

    return result;
  }
}
