# @ngx-config/core [![npm version](https://badge.fury.io/js/%40ngx-config%2Fcore.svg)](https://www.npmjs.com/package/@ngx-config/core) [![npm downloads](https://img.shields.io/npm/dm/%40ngx-config%2Fcore.svg)](https://www.npmjs.com/package/@ngx-config/core)

Configuration utility for **Angular**

[![CircleCI](https://circleci.com/gh/fulls1z3/ngx-config.svg?style=shield)](https://circleci.com/gh/fulls1z3/ngx-config)
[![coverage](https://codecov.io/github/fulls1z3/ngx-config/coverage.svg?branch=master)](https://codecov.io/gh/fulls1z3/ngx-config)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

**`@ngx-config/core`** uses `APP_INITIALIZER` which executes a function when **Angular** app is initialized, and delay the
completion of initialization process until application settings have been provided.

## Table of contents:

- [Getting started](#getting-started)
  - [Installation](#installation) - [Examples](#examples) - [Related packages](#related-packages) - [Recommended packages](#recommended-packages) - [Adding `@ngx-config/core` to your project (SystemJS)](#adding-systemjs)
  - [app.module configuration](#appmodule-config)
- [Settings](#settings) - [Setting up `ConfigModule` to use `ConfigStaticLoader`](#setting-up-staticloader) - [Setting up `ConfigModule` to use `ConfigHttpLoader`](#setting-up-httploader) - [Setting up `ConfigModule` to use `ConfigMergeLoader`](#setting-up-mergeloader)
- [Usage](#usage)
- [Pipe](#pipe)
- [License](#license)

## <a name="getting-started"> Getting started

### <a name="installation"> Installation

You can install **`@ngx-config/core`** using `npm`

```
npm install @ngx-config/core --save
```

### <a name="examples"></a> Examples

- [ng-seed/universal] and [fulls1z3/example-app] are officially maintained projects, showcasing common patterns and best
  practices for **`@ngx-config/core`**.

### <a name="related-packages"></a> Related packages

The following packages may be used in conjunction with **`@ngx-config/core`**:

- [@ngx-config/http-loader]
- [@ngx-config/merge-loader]
- [@ngx-i18n-router/config-loader]

### <a name="recommended-packages"></a> Recommended packages

The following package(s) have no dependency for **`@ngx-config/core`**, however may provide supplementary/shorthand functionality:

- [@ngx-cache/core]: provides caching features to retrieve the application settings using `non-static loaders` (_[@ngx-config/http-loader],
  [@ngx-i18n-router/config-loader]_).

### <a name="adding-systemjs"></a> Adding `@ngx-config/core` to your project (SystemJS)

Add `map` for **`@ngx-config/core`** in your `systemjs.config`

```javascript
'@ngx-config/core': 'node_modules/@ngx-config/core/bundles/core.umd.min.js'
```

### <a name="appmodule-config"></a> app.module configuration

Import `ConfigModule` using the mapping `'@ngx-config/core'` and append `ConfigModule.forRoot({...})` within the imports
property of **app.module** (_considering the app.module is the core module in Angular application_).

## <a name="settings"></a> Settings

You can call the [forRoot] static method using `ConfigStaticLoader`. By default, it is configured to have no settings.

> You can customize this behavior (_and ofc other settings_) by supplying **application settings** to `ConfigStaticLoader`.

The following examples show the use of an exported function (_instead of an inline function_) for [AoT compilation].

### <a name="setting-up-staticloader"></a> Setting up `ConfigModule` to use `ConfigStaticLoader`

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
  ...
  imports: [
    ConfigModule.forRoot({
      provide: ConfigLoader,
      useFactory: (configFactory)
    }),
    ...
  ],
  ...
  bootstrap: [AppComponent]
})
```

`ConfigStaticLoader` has one parameter:

- **providedSettings**: `any` : application settings

> :+1: Cool! **`@ngx-config/core`** will retrieve application settings before **Angular** initializes the app.

### <a name="setting-up-httploader"></a> Setting up `ConfigModule` to use `ConfigHttpLoader`

If you provide application settings using a `JSON` file or an `API`, you can call the [forRoot] static method using the
`ConfigHttpLoader`. By default, it is configured to retrieve **application settings** from the endpoint `/config.json`
(_if not specified_).

> You can customize this behavior (_and ofc other settings_) by supplying a **api endpoint** to `ConfigHttpLoader`.

You can find detailed information about the usage guidelines for the `ConfigHttpLoader` [here](https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/http-loader).

### <a name="setting-up-mergeloader"></a> Setting up `ConfigModule` to use `ConfigMergeLoader`

`ConfigMergeLoader` provides application settings by executing loaders in **parallel** and in **series**.

You can find detailed information about the usage guidelines for the `ConfigMergeLoader` [here](https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/merge-loader).

## <a name="usage"></a> Usage

`ConfigService` has the `getSettings` method, which you can fetch settings loaded during application initialization.

When the `getSettings` method is invoked without parameters, it returns entire application configuration. However, the `getSettings`
method can be invoked using two optional parameters: **`key`** and **`defaultValue`**.

To specify returning value type you can add generic type in `getSettings`.

The following example shows how to read configuration settings using all available overloads of `getSettings` method.

#### anyclass.ts

```TypeScript
...
import { ConfigService } from '@ngx-config/core';

@Injectable()
export class AnyClass {
  constructor(private readonly config: ConfigService) {
    // note that ConfigService is injected into a private property of AnyClass
  }

  myMethodToGetUrl1a() {
    // will retrieve 'http://localhost:8000'
    const url = this.config.getSettings<string>('system.applicationUrl');
  }

  myMethodToGetUrl1b() {
    // will retrieve 'http://localhost:8000'
    const url = this.config.getSettings<string>(['system', 'applicationUrl']);
  }

  myMethodToGetUrl2a() {
    // will retrieve 'http://localhost:8000'
    const url = this.config.getSettings<string>('system').applicationUrl;
  }

  myMethodToGetUrl2b() {
    // will retrieve 'http://localhost:8000'
    const url = this.config.getSettings<string>().system.applicationUrl;
  }

  myMethodToGetUrl3a() {
    // will throw an exception (system.non_existing is not in the application settings)
    const url = this.config.getSettings<string>('system.non_existing');
  }

  myMethodToGetUrl3b() {
    // will retrieve 'no data' (system.non_existing is not in the application settings)
    const url = this.config.getSettings<string>('system.non_existing', 'no data');
  }

  myMethodToGetSeo1() {
    // will retrieve {"pageTitle":"Tweeting bird"}
    const seoSettings = this.config.getSettings<string>('seo');
  }

  myMethodToGetSeo1() {
    // will retrieve {"pageTitle":"Tweeting bird"}
    const seoSettings = this.config.getSettings<string>().seo;
  }
}
```

## <a name="pipe"></a> Pipe

`ConfigPipe` is used to get the application settings on the view level. Pipe can be appended to a **string** or to an
**Array<string>**.

```Html
<span id="property">{{'some.setting' | config}}</span>
<span id="property">{{['some', 'setting'] | config}}</span>
```

In order to use this pipe in lazy-loaded modules, you must import `ConfigModule.forChild()`.

## <a name="license"></a> License

The MIT License (MIT)

Copyright (c) 2019 [Burak Tasci]

[ng-seed/universal]: https://github.com/ng-seed/universal
[fulls1z3/example-app]: https://github.com/fulls1z3/example-app
[@ngx-config/http-loader]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/http-loader
[@ngx-config/merge-loader]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/merge-loader
[@ngx-i18n-router/config-loader]: https://github.com/fulls1z3/ngx-i18n-router/tree/master/packages/@ngx-i18n-router/config-loader
[@ngx-cache/core]: https://github.com/fulls1z3/ngx-cache/tree/master/packages/@ngx-cache/core
[forroot]: https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
[aot compilation]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
[burak tasci]: https://github.com/fulls1z3
