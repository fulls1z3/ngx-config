# Change Log
All notable changes to this project will be documented in this file.

## Current iteration
### Breaking changes
- **packaging:** merge public API into a single repository

## v0.2.0-rc.5 - 2017-04-25
### Breaking changes
- **packaging:** rename `@nglibs/config` to `@ngx-config/core` (closes [#10](https://github.com/fulls1z3/ngx-config/issues/10))
- **packaging:** separate loaders from the package (closes [#11](https://github.com/fulls1z3/ngx-config/issues/11))

### Bug fixes
- **core:** add `yarn.lock` to npmignore (closes [#9](https://github.com/fulls1z3/ngx-config/issues/9))

### Features
- **core:** add get method can retrieve value at any deep (closes [#12](https://github.com/fulls1z3/ngx-config/issues/12))
- **core:** add `ConfigPipe` (closes [#13](https://github.com/fulls1z3/ngx-config/issues/13))

## v0.2.0-rc.4 - 2017-03-15
### Bug fixes
- **core:** depend on Angular 2.0.0 (closes [#3](https://github.com/fulls1z3/ngx-config/issues/3))

## v0.2.0-rc.3 - 2017-02-23
### Bug fixes
- **core:** depend on TypeScript 2.1.x

## v0.2.0-rc.2 - 2017-02-20
### Features
- **core:** add `ConfigStaticLoader` (closes [#2](https://github.com/fulls1z3/ngx-config/issues/2))

## v0.2.0-rc.1 - 2017-02-17
### Breaking changes
- **core:** rename `ConfigStaticLoader` to `ConfigHttpLoader`
- **packaging:** merge with [fulls1z3/ng2-config](https://github.com/fulls1z3/ng2-config)

### Bug fixes
- **core:** depend on `tslib`

### Features
- **core:** move tests in `tests` folder
