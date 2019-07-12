import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { ConfigLoader, ConfigStaticLoader } from './src/config.loader';
import { ConfigPipe } from './src/config.pipe';
import { ConfigService } from './src/config.service';

export * from './src/config.loader';
export * from './src/config.pipe';
export * from './src/config.service';

// for AoT compilation
// tslint:disable-next-line
export function configFactory(): ConfigLoader {
  return new ConfigStaticLoader();
}

// tslint:disable-next-line
export function initializerFactory(config: ConfigService): any {
  // workaround for AoT compilation
  const res = () => config.init();

  return res;
}

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
}
