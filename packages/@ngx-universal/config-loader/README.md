# @ngx-universal/config-loader
Loader for [ngx-config] that provides application settings to **browser**/**server** platforms

[![npm version](https://badge.fury.io/js/%40ngx-universal%2Fconfig-loader.svg)](https://www.npmjs.com/package/@ngx-universal/config-loader)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

## Table of contents:
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Installation](#installation)
	- [Examples](#examples)
	- [Related packages](#related-packages)
	- [Adding `@ngx-universal/config-loader` to your project (SystemJS)](#adding-systemjs)
- [Settings](#settings)
	- [Setting up `ConfigModule` to use `UniversalConfigLoader`](#setting-up-universalloader)
- [License](#license)

## <a name="prerequisites"></a> Prerequisites
This package depends on `Angular v4.0.0`. Older versions contain outdated dependencies, might produce errors.

Also, please ensure that you are using **`Typescript v2.3.4`** or higher.

## <a name="getting-started"> Getting started
### <a name="installation"> Installation
You can install **`@ngx-universal/config-loader`** using `npm`
```
npm install @ngx-universal/config-loader --save
```

**Note**: You should have already installed [@ngx-config/core].

### <a name="examples"></a> Examples
- [ng-seed/universal] is an officially maintained seed project, showcasing common patterns and best practices for **`@ngx-universal/config-loader`**.

### <a name="related-packages"></a> Related packages
The following packages may be used in conjunction with **`@ngx-universal/config-loader`**:
- [@ngx-config/core]
- [@ngx-config/http-loader]
- [@ngx-config/fs-loader]

### <a name="adding-systemjs"></a> Adding `@ngx-universal/config-loader` to your project (SystemJS)
Add `map` for **`@ngx-universal/config-loader`** in your `systemjs.config`
```javascript
'@ngx-universal/config-loader': 'node_modules/@ngx-universal/config-loader/bundles/config-loader.umd.min.js'
```

## <a name="settings"></a> Settings
### <a name="setting-up-universalloader"></a> Setting up `ConfigModule` to use `UniversalConfigLoader`
`UniversalConfigLoader` requires a `browserLoader` and a `serverLoader` to load application settings on both platforms.
- Import `ConfigModule` using the mapping `'@ngx-config/core'` and append `ConfigModule.forRoot({...})` within the imports
property of **app.module**.
- Import `UniversalConfigLoader` using the mapping `'@ngx-universal/config-loader'`.

**Note**: *Considering the app.module is the core module in Angular application*.

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
import { ConfigModule, ConfigLoader, ConfigStaticLoader } from '@ngx-config/core';
import { ConfigFsLoader } from '@ngx-config/fs-loader';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { UniversalConfigLoader } from '@ngx-universal/config-loader';
...

export function configFactory(platformId: any, http: Http): ConfigLoader {
  const serverLoader = new ConfigFsLoader('./public/assets/config.json'); // FILE PATH
  const browserLoader = new ConfigHttpLoader(http, './assets/config.json'); // API ENDPOINT

  return new UniversalConfigLoader(platformId, serverLoader, browserLoader);
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
      deps: [PLATFORM_ID, Http]
    }),
    ...
  ],
  ...
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private readonly platformId: any) {
  }
}
```

`UniversalConfigLoader` has two parameters:
- **serverLoader**: `ConfigLoader` : the loader which will run on the `server` platform (*ex: `ConfigFsLoader`, or `ConfigStaticLoader`*)
- **browserLoader**: `ConfigLoader` : the loader which will run on the `browser` platform (*ex: `ConfigHttpLoader`, or `ConfigStaticLoader`*)

> :+1: Well! **`@ngx-universal/config-loader`** will now provide **application settings** to **browser**/**server** platforms.

## <a name="license"></a> License
The MIT License (MIT)

Copyright (c) 2017 [Burak Tasci]

[ngx-config]: https://github.com/fulls1z3/ngx-config
[ng-seed/universal]: https://github.com/ng-seed/universal
[@ngx-config/core]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/core
[@ngx-config/http-loader]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/http-loader
[@ngx-config/fs-loader]: https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/fs-loader
[Burak Tasci]: https://github.com/fulls1z3
