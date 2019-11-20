# @ngx-config/http-loader [![npm version](https://badge.fury.io/js/%40ngx-config%2Fhttp-loader.svg)](https://www.npmjs.com/package/@ngx-config/http-loader) [![npm downloads](https://img.shields.io/npm/dm/%40ngx-config%2Fhttp-loader.svg)](https://www.npmjs.com/package/@ngx-config/http-loader)

Loader for [ngx-config] that provides application settings using **`http`**

[![CircleCI](https://circleci.com/gh/fulls1z3/ngx-config.svg?style=shield)](https://circleci.com/gh/fulls1z3/ngx-config)
[![coverage](https://codecov.io/github/fulls1z3/ngx-config/coverage.svg?branch=master)](https://codecov.io/gh/fulls1z3/ngx-config)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

## Table of contents:

- [Getting started](#getting-started)
  - [Installation](#installation) - [Examples](#examples) - [Related packages](#related-packages) - [Adding `@ngx-config/http-loader` to your project (SystemJS)](#adding-systemjs)
- [Settings](#settings) - [Setting up `ConfigModule` to use `ConfigHttpLoader`](#setting-up-httploader)
- [License](#license)

## <a name="getting-started"> Getting started

### <a name="installation"> Installation

You can install **`@ngx-config/http-loader`** using `npm`

```
npm install @ngx-config/http-loader --save
```

**Note**: You should have already installed [@ngx-config/core].

### <a name="examples"></a> Examples

- [ng-seed/universal] and [fulls1z3/example-app] are officially maintained projects, showcasing common patterns and best
  practices for **`@ngx-config/http-loader`**.

### <a name="related-packages"></a> Related packages

The following packages may be used in conjunction with **`@ngx-config/http-loader`**:

- [@ngx-config/core]
- [@ngx-config/merge-loader]

### <a name="adding-systemjs"></a> Adding `@ngx-config/http-loader` to your project (SystemJS)

Add `map` for **`@ngx-config/http-loader`** in your `systemjs.config`

```javascript
'@ngx-config/http-loader': 'node_modules/@ngx-config/http-loader/bundles/http-loader.umd.min.js'
```

## <a name="settings"></a> Settings

### <a name="setting-up-httploader"></a> Setting up `ConfigModule` to use `ConfigHttpLoader`

If you provide application settings using a `JSON` file or an `API`, you can call the [forRoot] static method using the
`ConfigHttpLoader`. By default, it is configured to retrieve **application settings** from the endpoint `/config.json`
(_if not specified_).

> You can customize this behavior (_and ofc other settings_) by supplying a **api endpoint** to `ConfigHttpLoader`.

- Import `ConfigModule` using the mapping `'@ngx-config/core'` and append `ConfigModule.forRoot({...})` within the imports
  property of **app.module**.
- Import `ConfigHttpLoader` using the mapping `'@ngx-config/http-loader'`.

**Note**: _Considering the app.module is the core module in Angular application_.

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
  "i18n": {
    "locale": "en"
  }
}
```

#### app.module.ts

```TypeScript
...
import { HttpClient } from '@angular/common/http';
import { ConfigModule, ConfigLoader,  } from '@ngx-config/core';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
...

export function configFactory(http: HttpClient): ConfigLoader {
  return new ConfigHttpLoader(http, './config.json'); // API ENDPOINT
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
      useFactory: (configFactory),
      deps: [HttpClient]
    }),
    ...
  ],
  ...
  bootstrap: [AppComponent]
})
```

`ConfigHttpLoader` has two parameters:

- **http**: `HttpClient` : Http instance
- **endpoint**: `string` : the `API endpoint`, to retrieve application settings from (_by default, `config.json`_)

> :+1: Well! **`@ngx-config/http-loader`** will now provide **application settings** to [@ngx-config/core] using `http`.

## <a name="license"></a> License

The MIT License (MIT)

Copyright (c) 2019 [Burak Tasci]

[ngx-config]: https://github.com/fulls1z3/ngx-config
[ng-seed/universal]: https://github.com/ng-seed/universal
[fulls1z3/example-app]: https://github.com/fulls1z3/example-app
[@ngx-config/core]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/core
[@ngx-config/merge-loader]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/merge-loader
[forroot]: https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
[burak tasci]: https://github.com/fulls1z3
