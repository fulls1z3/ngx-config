import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { ConfigLoader, ConfigStaticLoader } from './config.loader';
import { ConfigPipe } from './config.pipe';
import { ConfigService } from './config.service';

export const configFactory = () => new ConfigStaticLoader();

export const initializerFactory = (config: ConfigService) => {
  // workaround for AoT compilation
  const res = () => config.init();

  return res;
};

@NgModule({
  declarations: [ConfigPipe],
  exports: [ConfigPipe]
})
export class ConfigModule {
  static forRoot(
    configuredProvider: any = {
      provide: ConfigLoader,
      useFactory: configFactory
    }
  ): ModuleWithProviders {
    return {
      ngModule: ConfigModule,
      providers: [
        configuredProvider,
        ConfigService,
        {
          provide: APP_INITIALIZER,
          useFactory: initializerFactory,
          deps: [ConfigService],
          multi: true
        }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule?: ConfigModule) {
    if (parentModule) {
      throw new Error('ConfigModule already loaded; import in root module only.');
    }
  }
}
