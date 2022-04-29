import { Config } from 'stylelint';
import { stylelint } from '@ebullience/web-project-config';

const config: Partial<Config> = {
  ...stylelint,
  rules: {
    ...stylelint.rules,
    'color-hex-length': null
  }
};

export { config };
