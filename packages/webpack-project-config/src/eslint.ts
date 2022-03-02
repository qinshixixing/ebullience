import { Linter } from 'eslint';
import { eslint } from '@ebullience/web-project-config';

const config: Linter.Config = {
  ...eslint,
  rules: {
    ...eslint.rules,
    // 关闭any检测
    '@typescript-eslint/no-explicit-any': 'off',
    // 关闭require检测
    '@typescript-eslint/no-var-requires': 'off',
    'react/prop-types': 'off'
  }
};

export { config };
