# Change Log
All notable changes to this project will be documented in this file.

## v0.2.0-rc.5 - 2017-04-25
### Breaking change
- `@nglibs/config` has been renamed to `@ngx-config/core` (closes [#10](https://github.com/ngx-config/core/issues/10))
- separate loaders from the package (closes [#11](https://github.com/ngx-config/core/issues/11))

### Added
- Added make get method can retrieve value at any deep (closes [#12](https://github.com/ngx-config/core/issues/12))
- Added `ConfigPipe` (closes [#13](https://github.com/ngx-config/core/issues/13))

### Fixed
- Resolved add `yarn.lock` to npmignore (closes [#9](https://github.com/ngx-config/core/issues/9))

### Changed
- Updated README.md
- Updated deps, gulp tasks
- Some refactoring

## v0.2.0-rc.4 - 2017-03-15
### Fixed
- Resolved depend on Angular 2.0.0 (closes [#3](https://github.com/ngx-config/core/issues/3))
- Workaround for AoT compilation

### Changed
- Updated deps
- Some refactoring

## v0.2.0-rc.3 - 2017-02-23
### Fixed
- Forced to use TypeScript 2.1.x

### Changed
- Updated README.md
- Updated deps
- Some refactoring

## v0.2.0-rc.2 - 2017-02-20
### Added
- Added `ConfigStaticLoader` (closes [#2](https://github.com/ngx-config/core/issues/2))

## v0.2.0-rc.1 - 2017-02-17
### Changed
- Some refactoring

## v0.2.0-beta.3 - 2017-02-11
### Changed
- Updated README.md
- Some refactoring

## v0.2.0-beta.2 - 2017-02-11
### Breaking change
- `ConfigStaticLoader` has been renamed to `ConfigHttpLoader`

### Changed
- Updated README.md
- Moved tests in `tests` folder
- Some refactoring

## v0.2.0-beta.1 - 2017-02-09
### Fixed
- Fixed `tslib` dep

### Merged with @fulls1z3/ng2-config
- Merged with [fulls1z3/ng2-config](https://github.com/fulls1z3/ng2-config)
- Updated deps
- Stability fixes
