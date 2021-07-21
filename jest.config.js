module.exports = {
  displayName: 'ngx-config',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/tools/test/jest.setup.ts'],
  testResultsProcessor: './node_modules/jest-junit-reporter',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: {
        before: ['jest-preset-angular/build/InlineFilesTransformer', 'jest-preset-angular/build/StripStylesTransformer']
      }
    }
  },
  moduleNameMapper: {
    '^@ngx-config/core': '<rootDir>/packages/@ngx-config/core/src/index.ts',
    '^@ngx-config/http-loader': '<rootDir>/packages/@ngx-config/http-loader/src/index.ts',
    '^@ngx-config/merge-loader': '<rootDir>/packages/@ngx-config/merge-loader/src/index.ts'
  },
  cache: false,
  silent: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/@ngx-config/core/src/**.ts',
    'packages/@ngx-config/http-loader/src/**.ts',
    'packages/@ngx-config/merge-loader/src/**.ts'
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
