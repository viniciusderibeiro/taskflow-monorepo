module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [, 'bug', 'chore', 'ci', 'docs', 'enhancement', 'feat']]
  }
};