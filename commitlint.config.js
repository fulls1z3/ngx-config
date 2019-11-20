module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['core', 'http-loader', 'merge-loader', 'package', 'npm', 'circle', 'lint', 'packaging', 'changelog']]
  }
};
