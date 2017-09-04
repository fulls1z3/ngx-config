# ngx-config
Configuration utility for **Angular**

[![CircleCI](https://circleci.com/gh/fulls1z3/ngx-config.svg?style=shield)](https://circleci.com/gh/fulls1z3/ngx-config)
[![coverage](https://codecov.io/github/fulls1z3/ngx-config/coverage.svg?branch=master)](https://codecov.io/gh/fulls1z3/ngx-config)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

> Please support this project by simply putting a Github star. Share this library with friends on Twitter and everywhere else you can.

**`ngx-config`** uses `APP_INITIALIZER` which executes a function when **Angular** app is initialized, and delay the completion
of initialization process until application settings have been provided.

## Packages:
Name | Description | NPM
--- | --- | ---
[@ngx-config/core](https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/core) | Configuration utility for **Angular** | [![npm version](https://badge.fury.io/js/%40ngx-config%2Fcore.svg)](https://www.npmjs.com/package/@ngx-config/core)
[@ngx-config/http-loader](https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/http-loader) | Loader for [ngx-config] that provides application settings using **`http`** | [![npm version](https://badge.fury.io/js/%40ngx-config%2Fhttp-loader.svg)](https://www.npmjs.com/package/@ngx-config/http-loader)
[@ngx-config/fs-loader](https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/fs-loader) | Loader for [ngx-config] that provides application settings using **`fs`** (server platform) | [![npm version](https://badge.fury.io/js/%40ngx-config%2Ffs-loader.svg)](https://www.npmjs.com/package/@ngx-config/fs-loader)
[@ngx-config/merge-loader](https://github.com/fulls1z3/ngx-config/tree/master/packages/@ngx-config/merge-loader) | Loader for [ngx-config] that provides application settings by executing loaders in **parallel** and in **series** | [![npm version](https://badge.fury.io/js/%40ngx-config%2Fmerge-loader.svg)](https://www.npmjs.com/package/@ngx-config/merge-loader)

## Examples
- [ng-seed/universal] and [fulls1z3/example-app] are officially maintained projects, showcasing common patterns and best
practices for **`ngx-config`**.

## Contributing
If you want to file a bug, contribute some code, or improve documentation, please read up on the following contribution guidelines:
- [Issue guidelines](CONTRIBUTING.md#submit)
- [Contributing guidelines](CONTRIBUTING.md)
- [Coding rules](CONTRIBUTING.md#rules)
- [Change log](CHANGELOG.md)

## License
The MIT License (MIT)

Copyright (c) 2017 [Burak Tasci]

[ngx-config]: https://github.com/fulls1z3/ngx-config
[ng-seed/universal]: https://github.com/ng-seed/universal
[fulls1z3/example-app]: https://github.com/fulls1z3/example-app
[Burak Tasci]: https://github.com/fulls1z3
