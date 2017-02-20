// angular
import { APP_INITIALIZER, NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

// module
import { ConfigLoader, ConfigStaticLoader } from './src/config.loader';
import { ConfigService } from './src/config.service';

export * from './src/config.loader';
export * from './src/config.service';

export function configFactory(): ConfigLoader {
    return new ConfigStaticLoader();
}

function initializerFactory(loader: ConfigLoader): any {
    return () => loader.init();
}

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
@NgModule()
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
                    deps: [ConfigLoader],
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
