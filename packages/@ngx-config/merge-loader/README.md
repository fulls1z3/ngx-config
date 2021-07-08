# @ngx-config/merge-loader [![npm version](https://badge.fury.io/js/%40ngx-config%2Fmerge-loader.svg)](https://www.npmjs.com/package/@ngx-config/merge-loader) [![npm downloads](https://img.shields.io/npm/dm/%40ngx-config%2Fmerge-loader.svg)](https://www.npmjs.com/package/@ngx-config/merge-loader)

Loader for [ngx-config] that provides application settings by executing loaders in **parallel** and in **series**

[![CircleCI](https://circleci.com/gh/fulls1z3/ngx-config.svg?style=shield)](https://circleci.com/gh/fulls1z3/ngx-config)
[![coverage](https://codecov.io/github/fulls1z3/ngx-config/coverage.svg?branch=master)](https://codecov.io/gh/fulls1z3/ngx-config)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

## Table of contents:

- [Getting started](#getting-started)
  - [Installation](#installation) - [Examples](#examples) - [Related packages](#related-packages) - [Adding `@ngx-config/merge-loader` to your project (SystemJS)](#adding-systemjs)
- [Settings](#settings) - [Setting up `ConfigModule` to use `ConfigMergeLoader`](#setting-up-mergeloader)
- [License](#license)

## <a name="getting-started"> Getting started

### <a name="installation"> Installation

You can install **`@ngx-config/merge-loader`** using `npm`

```
npm install @ngx-config/merge-loader --save
```

**Note**: You should have already installed [@ngx-config/core].

### <a name="examples"></a> Examples

- [fulls1z3/universal] and [fulls1z3/example-app] are officially maintained projects, showcasing common patterns and best
  practices for **`@ngx-config/merge-loader`**.

### <a name="related-packages"></a> Related packages

The following packages may be used in conjunction with **`@ngx-config/merge-loader`**:

- [@ngx-config/core]
- [@ngx-config/http-loader]

### <a name="adding-systemjs"></a> Adding `@ngx-config/merge-loader` to your project (SystemJS)

Add `map` for **`@ngx-config/merge-loader`** in your `systemjs.config`

```javascript
'@ngx-config/merge-loader': 'node_modules/@ngx-config/merge-loader/bundles/merge-loader.umd.min.js'
```

## <a name="settings"></a> Settings

### <a name="setting-up-mergeloader"></a> Setting up `ConfigModule` to use `ConfigMergeLoader`

`ConfigMergeLoader` requires one or more loaders of type `ConfigLoader` to load application settings by executing specified
loaders in **parallel** and in **series**.

- Import `ConfigModule` using the mapping `'@ngx-config/core'` and append `ConfigModule.forRoot({...})` within the imports
  property of **app.module**.
- Import `ConfigMergeLoader` using the mapping `'@ngx-config/merge-loader'`.

**Note**: _Considering the app.module is the core module in Angular application_.

#### app.module.ts

```TypeScript
...
import { HttpClient } from '@angular/common/http';
import { ConfigModule, ConfigLoader } from '@ngx-config/core';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { ConfigMergeLoader } from '@ngx-config/merge-loader';
...

export function configFactory(http: HttpClient): ConfigLoader {
  const remoteConfigLoader = new ConfigHttpLoader(http, 'http://mysite.com/api/settings'); // API ENDPOINT (remote)
  const localConfigLoader = new ConfigHttpLoader(http, './config.local.json'); // API ENDPOINT (local)

  return new ConfigMergeLoader([remoteConfigLoader, localConfigLoader]); // PARALLEL EXECUTION
}

export function configFactorySeries(http: HttpClient): ConfigLoader {
  const localConfigLoader = new ConfigHttpLoader(http, './config.local.json'); // API ENDPOINT (local)

  return new ConfigMergeLoader([localConfigLoader])
    .next((res: any) => new ConfigHttpLoader(http, res['apiEndpoint'] + 'api/settings')); // SERIES EXECUTION
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
      deps: [Http]
    }),
    ...
  ],
  ...
  bootstrap: [AppComponent]
})
```

`ConfigMergeLoader` has one parameter:

- **loaders**: `Array<ConfigLoader>` : the `loaders` to be executed (_by default, `[new ConfigStaticLoader()]`_)

`ConfigMergeLoader` has also the `next` public method, which you can pass the loader to be executed in series.

> :+1: Well! **`@ngx-config/merge-loader`** will now provide **application settings** to [@ngx-config/core] by executing
> loaders in **parallel** and in **series**.

## <a name="license"></a> License

The MIT License (MIT)

Copyright (c) 2021 [Burak Tasci]

[ngx-config]: https://github.com/fulls1z3/ngx-config
[fulls1z3/universal]: https://github.com/fulls1z3/universal
[fulls1z3/example-app]: https://github.com/fulls1z3/example-app
[@ngx-config/core]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/core
[@ngx-config/http-loader]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/http-loader
[burak tasci]: https://github.com/fulls1z3
