import { Linter } from 'eslint';

const config: Linter.Config = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    'shared-node-browser': true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    // 'node',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'import/no-mutable-exports': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-commonjs': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-extraneous-import': 'off',
    'node/no-missing-import': 'off',
    'import/no-unresolved': 'off',
    'no-process-exit': 'off',
    'node/shebang': 'off',
    'import/prefer-default-export': 'off',
    'node/no-unpublished-require': 'off'
  }
};

export { config };
