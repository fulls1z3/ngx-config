# @ngx-config/merge-loader
Loader for [ngx-config] that provides application settings by executing loaders in **parallel** and in **series**

[![npm version](https://badge.fury.io/js/%40ngx-config%2Fmerge-loader.svg)](https://www.npmjs.com/package/@ngx-config/merge-loader)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

## Table of contents:
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Installation](#installation)
	- [Examples](#examples)
	- [Related packages](#related-packages)
	- [Adding `@ngx-config/merge-loader` to your project (SystemJS)](#adding-systemjs)
- [Settings](#settings)
	- [Setting up `ConfigModule` to use `ConfigMergeLoader`](#setting-up-mergeloader)
- [License](#license)

## <a name="prerequisites"></a> Prerequisites
This package depends on `Angular v2.0.0` but it's highly recommended that you are running at least **`@angular v2.4.0`**
and **`@angular/router v3.4.0`**. Older versions contain outdated dependencies, might produce errors.

Also, please ensure that you are using **`Typescript v2.1.6`** or higher.

## <a name="getting-started"> Getting started
### <a name="installation"> Installation
You can install **`@ngx-config/merge-loader`** using `npm`
```
npm install @ngx-config/merge-loader --save
```

**Note**: You should have already installed [@ngx-config/core].

### <a name="examples"></a> Examples
- [ng-seed/universal] and [ng-seed/spa] are officially maintained seed projects, showcasing common patterns and best practices
for **`@ngx-config/merge-loader`**.

### <a name="related-packages"></a> Related packages
The following packages may be used in conjunction with **`@ngx-config/merge-loader`**:
- [@ngx-config/core]
- [@ngx-config/http-loader]
- [@ngx-config/fs-loader]

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

**Note**: *Considering the app.module is the core module in Angular application*.

#### app.module.ts
```TypeScript
...
import { Http } from '@angular/http';
import { ConfigModule, ConfigLoader } from '@ngx-config/core';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { ConfigMergeLoader } from '@ngx-config/merge-loader';
...

export function configFactory(http: Http): ConfigLoader {
  const remoteConfigLoader = new ConfigHttpLoader(http, 'http://mysite.com/api/get-settings'); // API ENDPOINT (remote)
  const localConfigLoader = new ConfigHttpLoader(http, './config.local.json'); // API ENDPOINT (local)
  
  return new ConfigMergeLoader([remoteConfigLoader, localConfigLoader]); // PARALLEL EXECUTION
}

export function configFactorySeries(http: Http): ConfigLoader {
  const localConfigLoader = new ConfigHttpLoader(http, './config.local.json'); // API ENDPOINT (local)

  return new ConfigMergeLoader([localConfigLoader])
    .next((res: any) => new ConfigHttpLoader(http, res['apiEndpoint'] + 'api/get-settings')); // SERIES EXECUTION
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
- **loaders**: `Array<ConfigLoader>` : the `loaders` to be executed (*by default, `[new ConfigStaticLoader()]`*)

`ConfigMergeLoader` has also the `next` public method, which you can pass the loader to be executed in series.

> :+1: Well! **`@ngx-config/merge-loader`** will now provide **application settings** to [@ngx-config/core] by executing
loaders in **parallel** and in **series**.

## <a name="license"></a> License
The MIT License (MIT)

Copyright (c) 2017 [Burak Tasci]

[ngx-config]: https://github.com/fulls1z3/ngx-config
[ng-seed/universal]: https://github.com/ng-seed/universal
[ng-seed/spa]: https://github.com/ng-seed/spa
[@ngx-config/core]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/core
[@ngx-config/http-loader]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/http-loader
[@ngx-config/fs-loader]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/fs-loader
[Burak Tasci]: https://github.com/fulls1z3