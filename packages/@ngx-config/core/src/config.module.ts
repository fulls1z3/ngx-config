import {
  APP_INITIALIZER,
  Inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';

import { ConfigLoader, ConfigStaticLoader } from './config.loader';
import { ConfigPipe } from './config.pipe';
import { ConfigService } from './config.service';

export const configFactory = () => new ConfigStaticLoader();

export const initializerFactory = (config: ConfigService) => () => config.init();

export const CONFIG_FORROOT_GUARD = new InjectionToken('CONFIG_FORROOT_GUARD');

// tslint:disable-next-line:only-arrow-functions
export function provideForRootGuard(config?: ConfigService): any {
  if (config) {
    throw new Error(
      `ConfigModule.forRoot() called twice. Lazy loaded modules should use ConfigModule.forChild() instead.`
    );
  }

  return 'guarded';
}

// @dynamic
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
  ): ModuleWithProviders<ConfigModule> {
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
        },
        {
          provide: CONFIG_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[ConfigService, new Optional(), new SkipSelf()]]
        }
      ]
    };
  }

  static forChild(): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule
    };
  }

  // tslint:disable-next-line:no-empty
  constructor(@Optional() @Inject(CONFIG_FORROOT_GUARD) guard: any) {}
}
