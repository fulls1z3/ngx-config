// libs
import { readFileSync } from 'fs';
import { ConfigLoader } from '@ngx-config/core';

export class ConfigFsLoader implements ConfigLoader {
  constructor(private readonly path: string = '/config.json') {
  }

  loadSettings(): any {
    return Promise.resolve(JSON.parse(readFileSync(this.path, 'utf8')))
      .then((settings: any) => settings)
      .catch(() => Promise.reject('Path unreachable!'));
  }
}
