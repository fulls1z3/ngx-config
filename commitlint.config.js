module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['project-wide', 'core', 'http-loader', 'merge-loader', 'package', 'npm', 'webpack', 'circle', 'lint', 'packaging', 'changelog']
    ]
  }
};
