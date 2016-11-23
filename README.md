# @nglibs/config [![Linux build](https://travis-ci.org/nglibs/config.svg?branch=master)](https://travis-ci.org/nglibs/config) [![Windows build](https://ci.appveyor.com/api/projects/status/github/nglibs/config?branch=master&svg=true)](https://ci.appveyor.com/project/nglibs/config) [![coverage](https://codecov.io/github/nglibs/config/coverage.svg?branch=master)](https://codecov.io/gh/nglibs/config) [![npm version](https://badge.fury.io/js/%40nglibs%2Fconfig.svg)](https://www.npmjs.com/package/@nglibs/config)

> This repository holds the TypeScript source code and distributable bundle of **`@nglibs/config`**, the configuration utility for **Angular**.

**`@nglibs/config`** uses `APP_INITIALIZER` which executes a function when **Angular** app is initialized, and delay the initialization completion until configuration settings have been provided.

#### NOTICE
**`@nglibs/config`** is the successor of **`ng2-config`**, and the current latest version number is **`v0.2.x`**. Releases with version number **`1.X.x`** refer to **`ng2-config`**, and are being kept in order to maintain backwards compability - until **Angular** v4.0 (stable) gets released.

## Table of contents:
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
    - [Installation](#installation)
	- [Examples](#examples)
	- [@nglibs packages](#nglibs-packages)
	- [Adding @nglibs/config to your project (SystemJS)](#adding-nglibsconfig-to-your-project-systemjs)
    - [app.module configuration](#appmodule-configuration)
- [Usage](#usage)
- [License](#license)

## Prerequisites
Verify that you are running at least `@angular v2.4.0` and `@angular/router v3.4.0`. Older versions containing outdated dependencies, might produce errors.

You should also upgrade to a minimum version of `TypeScript 2.1.x`.

## Getting started
### Installation
You can install **`@nglibs/config`** using `npm`
```
npm install @nglibs/config --save
```

### Examples
- [@nglibs/example-app] is an officially maintained example application showcasing best practices for **[@nglibs]** utilities.

### @nglibs packages

- [@nglibs/config]
- [@nglibs/metadata]
- [@nglibs/i18n-router]
- [@nglibs/i18n-router-config-loader]

### Adding @nglibs/config to your project (SystemJS)
Add `map` for **`@nglibs/config`** in your `systemjs.config`
```javascript
'@nglibs/config': 'node_modules/@nglibs/config/bundles/config.umd.min.js'
```

### app.module configuration
Import `ConfigModule` using the mapping `'@nglibs/config'` and append `ConfigModule.forRoot({...})` within the imports property of **app.module** (*considering the app.module is the core module in Angular application*).

You can call the [forRoot] static method using the `ConfigHttpLoader`. By default, it is configured to fetch **config** from the path `/config.json` (if no endpoint is specified).

You can customize this behavior (*and ofc other settings*) by supplying a path/api endpoint to `ConfigHttpLoader`.

The following example shows the use of an exported function (*instead of an inline function*) for [AoT compilation].

```TypeScript
...
import { ConfigModule, ConfigLoader, ConfigHttpLoader } from '@nglibs/config';
...

export function configFactory() {
  return new ConfigHttpLoader('/config.json'); // PATH || API ENDPOINT
}

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    ConfigModule.forRoot({
      provide: ConfigLoader,
      useFactory: (configFactory)
    }),
    ...
  ],
  bootstrap: [AppComponent]
})
```


Cool! **`@nglibs/config`** will retrieve the configuration settings before **Angular** initializes the app.

## Usage
`ConfigService` has the `getSettings` method, which you can fetch the configuration settings loaded during application initialization.

When the `getSettings` method is invoked without parameters, it returns entire application configuration. However, the `getSettings` method can be invoked using two optional parameters: **`group`** and **`key`**.

The following example shows how to read configuration setttings using all available overloads of `getSettings` method.

#### config.json
```json
{
  "system": {
    "applicationName": "Mighty Mouse",
    "applicationUrl": "http://localhost:8000"
  },
  "seo": {
    "pageTitle": "Tweeting bird"
  },
  "i18n":{
    "locale": "en"
  }
}
```

#### anyclass.ts
```TypeScript
import { ConfigService } from '@nglibs/config';

export class AnyClass {
  constructor(private readonly config: ConfigService) {
    // note that ConfigService is injected into a private property of AnyClass
  }
  
  myMethodToGetUrl1() {
    // will retrieve 'http://localhost:8000'
    let url:string = this.config.getSettings('system', 'applicationUrl');
  }

  myMethodToGetUrl2() {
    // will retrieve 'http://localhost:8000'
    let url:string = this.config.getSettings('system').applicationUrl;
  }

  myMethodToGetUrl3() {
    // will retrieve 'http://localhost:8000'
    let url:string = this.config.getSettings().system.applicationUrl;
  }
  
  myMethodToGetSeo1() {
    // will retrieve {"pageTitle":"Tweeting bird"}
    let seoSettings: string = this.config.getSettings('seo');
  }

  myMethodToGetSeo1() {
    // will retrieve {"pageTitle":"Tweeting bird"}
    let seoSettings: string = this.config.getSettings().seo;
  }
}
```

## License
The MIT License (MIT)

Copyright (c) 2017 [Burak Tasci]

[@nglibs]: https://github.com/nglibs
[@nglibs/example-app]: https://github.com/nglibs/example-app
[@nglibs/config]: https://github.com/nglibs/config
[@nglibs/metadata]: https://github.com/nglibs/metadata
[@nglibs/i18n-router]: https://github.com/nglibs/i18n-router
[@nglibs/i18n-router-config-loader]: https://github.com/nglibs/i18n-router-config-loader
[forRoot]: https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
[AoT compilation]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
[Burak Tasci]: http://www.buraktasci.com
