# @nglibs/config [![Linux build](https://travis-ci.org/nglibs/config.svg?branch=master)](https://travis-ci.org/nglibs/config) [![Windows build](https://ci.appveyor.com/api/projects/status/github/nglibs/config?branch=master&svg=true)](https://ci.appveyor.com/project/nglibs/config) [![coverage](https://codecov.io/github/nglibs/config/coverage.svg?branch=master)](https://codecov.io/gh/nglibs/config) [![npm version](https://badge.fury.io/js/%40nglibs%2Fconfig.svg)](https://www.npmjs.com/package/@nglibs/config)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

> This repository holds the TypeScript source code and distributable bundle of **`@nglibs/config`**, the configuration utility for **Angular**.

**`@nglibs/config`** uses `APP_INITIALIZER` which executes a function when **Angular** app is initialized, and delay the completion of initialization process until application settings have been provided.

#### NOTICE
**`@nglibs/config`** is the successor of **`ng2-config`**, and the actual release is **`v0.2.x`**.

## Table of contents:
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Installation](#installation)
	- [Examples](#examples)
	- [`@nglibs` packages](#nglibs-packages)
	- [Adding `@nglibs/config` to your project (SystemJS)](#adding-nglibsconfig-to-your-project-systemjs)
  - [app.module configuration](#appmodule-configuration)
- [Settings](#settings)
	- [Setting up `ConfigModule` to use `ConfigStaticLoader`](#setting-up-configmodule-to-use-configstaticloader)
	- [Setting up `ConfigModule` to use `ConfigHttpLoader`](#setting-up-configmodule-to-use-confighttploader)
- [Usage](#usage)
- [License](#license)

## Prerequisites
This package depends on `@angular v2.0.0` but it's highly recommended that you are running at least **`@angular v2.4.0`** and **`@angular/router v3.4.0`**. Older versions contain outdated dependencies, might produce errors.

Also, please ensure that you are using **`Typescript v2.1.6`** or higher.

## Getting started
### Installation
You can install **`@nglibs/config`** using `npm`
```
npm install @nglibs/config --save
```

### Examples
- [@nglibs/universal-example-app] and [@nglibs/example-app] are officially maintained example applications showcasing best practices for **[@nglibs]** utilities.

### `@nglibs` packages

- [@nglibs/config]
- [@nglibs/meta]
- [@nglibs/i18n-router]
- [@nglibs/i18n-router-config-loader]
- [@nglibs/universal-express-engine]
- [@nglibs/universal-transfer-state]

### Adding `@nglibs/config` to your project (SystemJS)
Add `map` for **`@nglibs/config`** in your `systemjs.config`
```javascript
'@nglibs/config': 'node_modules/@nglibs/config/bundles/config.umd.min.js'
```

### app.module configuration
Import `ConfigModule` using the mapping `'@nglibs/config'` and append `ConfigModule.forRoot({...})` within the imports property of **app.module** (*considering the app.module is the core module in Angular application*).

## Settings

You can call the [forRoot] static method using `ConfigStaticLoader`. By default, it is configured to have no settings.

> You can customize this behavior (*and ofc other settings*) by supplying **application settings** to `ConfigStaticLoader`.

If you provide application settings using a `JSON` file or an `API`, you can call the [forRoot] static method using the `ConfigHttpLoader`. By default, it is configured to retrieve **application settings** from the path `/config.json` (*if not specified*).

> You can customize this behavior (*and ofc other settings*) by supplying a **file path/api endpoint** to `ConfigHttpLoader`.

The following examples show the use of an exported function (*instead of an inline function*) for [AoT compilation].

### Setting up `ConfigModule` to use `ConfigStaticLoader`

```TypeScript
...
import { ConfigModule, ConfigLoader, ConfigStaticLoader } from '@nglibs/config';
...

export function configFactory(): ConfigLoader {
  return new ConfigStaticLoader({
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
  });
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

`ConfigStaticLoader` has one parameter:

- **settings**: `any` : application settings

### Setting up `ConfigModule` to use `ConfigHttpLoader`

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

#### app.module.ts
```TypeScript
...
import { Http } from '@angular/http';
import { ConfigModule, ConfigLoader, ConfigHttpLoader } from '@nglibs/config';
...

export function configFactory(http: Http): ConfigLoader {
  return new ConfigHttpLoader(http, '/config.json'); // FILE PATH || API ENDPOINT
}

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    ConfigModule.forRoot({
      provide: ConfigLoader,
      useFactory: (configFactory),
	  deps: [Http]
    }),
    ...
  ],
  bootstrap: [AppComponent]
})
```

`ConfigHttpLoader` has two parameters:

- **http**: `Http` : Http instance
- **path**: `string` : path to `JSON file`/`API endpoint`, to retrieve application settings from (*by default, `config.json`*)

> :+1: Cool! **`@nglibs/config`** will retrieve application settings before **Angular** initializes the app.

## Usage
`ConfigService` has the `getSettings` method, which you can fetch settings loaded during application initialization.

When the `getSettings` method is invoked without parameters, it returns entire application configuration. However, the `getSettings` method can be invoked using two optional parameters: **`group`** and **`key`**.

The following example shows how to read configuration setttings using all available overloads of `getSettings` method.

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
[@nglibs/universal-example-app]: https://github.com/nglibs/universal-example-app
[@nglibs/config]: https://github.com/nglibs/config
[@nglibs/meta]: https://github.com/nglibs/meta
[@nglibs/i18n-router]: https://github.com/nglibs/i18n-router
[@nglibs/i18n-router-config-loader]: https://github.com/nglibs/i18n-router-config-loader
[@nglibs/universal-express-engine]: https://github.com/nglibs/universal-express-engine
[@nglibs/universal-transfer-state]: https://github.com/nglibs/universal-transfer-state
[forRoot]: https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
[AoT compilation]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
[Burak Tasci]: http://www.buraktasci.com
