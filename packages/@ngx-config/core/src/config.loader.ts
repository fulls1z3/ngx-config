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
