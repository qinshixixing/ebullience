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
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  // plugins: [],
  // add your custom rules here,
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/display-name': 'off',
    'react/jsx-no-target-blank': 'off'
  }
};

export { config };
