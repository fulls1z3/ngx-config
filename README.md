# @ngx-config/core
Configuration utility for **Angular**

[![Linux build](https://travis-ci.org/ngx-config/core.svg?branch=master)](https://travis-ci.org/ngx-config/core) [![Windows build](https://ci.appveyor.com/api/projects/status/github/ngx-config/core?branch=master&svg=true)](https://ci.appveyor.com/project/ngx-config/core) [![coverage](https://codecov.io/github/ngx-config/core/coverage.svg?branch=master)](https://codecov.io/gh/ngx-config/core) [![npm version](https://badge.fury.io/js/%40ngx-config%2Fcore.svg)](https://www.npmjs.com/package/@ngx-config/core)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

**`@ngx-config/core`** uses `APP_INITIALIZER` which executes a function when **Angular** app is initialized, and delay the completion of initialization process until application settings have been provided.

## Table of contents:
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Installation](#installation)
	- [Examples](#examples)
	- [Related packages](#related-packages)
	- [Recommended packages](#recommended-packages)
	- [Adding `@ngx-config/core` to your project (SystemJS)](#adding-ngx-configcore-to-your-project-systemjs)
  - [app.module configuration](#appmodule-configuration)
- [Settings](#settings)
	- [Setting up `ConfigModule` to use `ConfigStaticLoader`](#setting-up-configmodule-to-use-configstaticloader)
	- [Setting up `ConfigModule` to use `ConfigHttpLoader`](#setting-up-configmodule-to-use-confighttploader)
	- [Setting up `ConfigModule` to use `ConfigFsLoader`](#setting-up-configmodule-to-use-configfsloader)
	- [Setting up `ConfigModule` to use `UniversalConfigLoader`](#setting-up-configmodule-to-use-universalconfigloader)
	- [Setting up `ConfigModule` to use `ConfigMergeLoader`](#setting-up-configmodule-to-use-configmergeloader)
- [Usage](#usage)
- [Pipe](#pipe)
- [License](#license)

## Prerequisites
This package depends on `@angular v2.0.0` but it's highly recommended that you are running at least **`@angular v2.4.0`** and **`@angular/router v3.4.0`**. Older versions contain outdated dependencies, might produce errors.

Also, please ensure that you are using **`Typescript v2.1.6`** or higher.

## Getting started
### Installation
You can install **`@ngx-config/core`** using `npm`
```
npm install @ngx-config/core --save
```

### Examples
- [ng-seed/universal] and [ng-seed/spa] are officially maintained seed projects, showcasing common patterns and best practices for **`@ngx-config/core`**.

### Related packages
The following packages may be used in conjunction with **`@ngx-config/core`**:
- [@ngx-config/http-loader]
- [@ngx-config/fs-loader]
- [@ngx-universal/config-loader]
- [@ngx-config/merge-loader]
- [@ngx-i18n-router/config-loader]

### Recommended packages
The following package(s) have no dependency for **`@ngx-config/core`**, however may provide supplementary/shorthand functionality:
- [@ngx-cache/core]: provides caching features to retrieve the application settings using `non-static loaders` (`http`, `fs`, etc.)

### Adding `@ngx-config/core` to your project (SystemJS)
Add `map` for **`@ngx-config/core`** in your `systemjs.config`
```javascript
'@ngx-config/core': 'node_modules/@ngx-config/core/bundles/core.umd.min.js'
```

### app.module configuration
Import `ConfigModule` using the mapping `'@ngx-config/core'` and append `ConfigModule.forRoot({...})` within the imports property of **app.module** (*considering the app.module is the core module in Angular application*).

## Settings
You can call the [forRoot] static method using `ConfigStaticLoader`. By default, it is configured to have no settings.

> You can customize this behavior (*and ofc other settings*) by supplying **application settings** to `ConfigStaticLoader`.

The following examples show the use of an exported function (*instead of an inline function*) for [AoT compilation].

### Setting up `ConfigModule` to use `ConfigStaticLoader`
```TypeScript
...
import { ConfigModule, ConfigLoader, ConfigStaticLoader } from '@ngx-config/core';
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

> :+1: Cool! **`@ngx-config/core`** will retrieve application settings before **Angular** initializes the app.

### Setting up `ConfigModule` to use `ConfigHttpLoader`
If you provide application settings using a `JSON` file or an `API`, you can call the [forRoot] static method using the `ConfigHttpLoader`. By default, it is configured to retrieve **application settings** from the endpoint `/config.json` (*if not specified*).

> You can customize this behavior (*and ofc other settings*) by supplying a **api endpoint** to `ConfigHttpLoader`.

You can find detailed information about the usage guidelines for the `ConfigHttpLoader` [here](https://github.com/ngx-config/http-loader).

### Setting up `ConfigModule` to use `ConfigFsLoader`
If you provide application settings using a `JSON` file (*on the `server platform`*), you can call the [forRoot] static method using the `ConfigFsLoader`. By default, it is configured to retrieve **application settings** from the path `/config.json` (*if not specified*).

> You can customize this behavior (*and ofc other settings*) by supplying a **file path** to `ConfigFsLoader`.

You can find detailed information about the usage guidelines for the `ConfigFsLoader` [here](https://github.com/ngx-config/fs-loader).

### Setting up `ConfigModule` to use `UniversalConfigLoader`
`UniversalConfigLoader` provides application settings to **browser**/**server** platforms.

You can find detailed information about the usage guidelines for the `UniversalConfigLoader` [here](https://github.com/ngx-universal/config-loader).

### Setting up `ConfigModule` to use `ConfigMergeLoader`
`ConfigMergeLoader` provides application settings by executing loaders in **parallel** and in **series**.

You can find detailed information about the usage guidelines for the `ConfigMergeLoader` [here](https://github.com/ngx-config/merge-loader).

## Usage
`ConfigService` has the `getSettings` method, which you can fetch settings loaded during application initialization.

When the `getSettings` method is invoked without parameters, it returns entire application configuration. However, the `getSettings` method can be invoked using two optional parameters: **`key`** and **`defaultValue`**.

The following example shows how to read configuration settings using all available overloads of `getSettings` method.

#### anyclass.ts
```TypeScript
import { ConfigService } from '@ngx-config/core';

export class AnyClass {
  constructor(private readonly config: ConfigService) {
    // note that ConfigService is injected into a private property of AnyClass
  }
  
  myMethodToGetUrl1a() {
    // will retrieve 'http://localhost:8000'
    let url:string = this.config.getSettings('system.applicationUrl');
  }

  myMethodToGetUrl1b() {
    // will retrieve 'http://localhost:8000'
    let url:string = this.config.getSettings(['system', 'applicationUrl']);
  }

  myMethodToGetUrl2a() {
    // will retrieve 'http://localhost:8000'
    let url:string = this.config.getSettings('system').applicationUrl;
  }

  myMethodToGetUrl2b() {
    // will retrieve 'http://localhost:8000'
    let url:string = this.config.getSettings().system.applicationUrl;
  }

  myMethodToGetUrl3a() {
    // will throw an exception (system.non_existing is not in the application settings)
    let url:string = this.config.getSettings('system.non_existing');
  }

  myMethodToGetUrl3b() {
    // will retrieve 'no data' (system.non_existing is not in the application settings)
    let url:string = this.config.getSettings('system.non_existing', 'no data');
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

## Pipe
`ConfigPipe` is used to get the application settings on the view level. Pipe can be appended to a **string** or to an **Array<string>**.

```Html
<span id="property">{{'some.setting' | config}}</span>
<span id="property">{{['some', 'setting'] | config}}</span>
```

## License
The MIT License (MIT)

Copyright (c) 2017 [Burak Tasci]

[ng-seed/universal]: https://github.com/ng-seed/universal
[ng-seed/spa]: https://github.com/ng-seed/spa
[@ngx-config/http-loader]: https://github.com/ngx-config/http-loader
[@ngx-config/fs-loader]: https://github.com/ngx-config/fs-loader
[@ngx-universal/config-loader]: https://github.com/ngx-universal/config-loader
[@ngx-config/merge-loader]: https://github.com/ngx-config/merge-loader
[@ngx-i18n-router/config-loader]: https://github.com/ngx-i18n-router/config-loader
[@ngx-cache/core]: https://github.com/ngx-cache/core
[forRoot]: https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
[AoT compilation]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
[Burak Tasci]: https://github.com/fulls1z3
