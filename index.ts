// angular
import { APP_INITIALIZER, NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

// module
import { ConfigLoader, ConfigStaticLoader } from './src/config.loader';
import { ConfigPipe } from './src/config.pipe';
import { ConfigService } from './src/config.service';

export * from './src/config.loader';
export * from './src/config.pipe';
export * from './src/config.service';

// for AoT compilation
export function configFactory(): ConfigLoader {
  return new ConfigStaticLoader();
}

export function initializerFactory(config: ConfigService): any {
  // workaround for AoT compilation
  const res = () => config.init();
  return res;
}

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
@NgModule({
  declarations: [ConfigPipe],
  exports: [ConfigPipe]
})
export class ConfigModule {
  static forRoot(configuredProvider: any = {
    provide: ConfigLoader,
    useFactory: (configFactory)
  }): ModuleWithProviders {
    return {
      ngModule: ConfigModule,
      providers: [
        configuredProvider,
        ConfigService,
        {
          provide: APP_INITIALIZER,
          useFactory: (initializerFactory),
          deps: [ConfigService],
          multi: true
        }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: ConfigModule) {
    if (parentModule)
      throw new Error('ConfigModule already loaded; import in root module only.');
  }
}
