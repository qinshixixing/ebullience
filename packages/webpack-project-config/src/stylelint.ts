import { Configuration } from 'stylelint';
import { stylelint } from '@ebullience/web-project-config';

const config: Partial<Configuration> = {
  ...stylelint,
  rules: {
    ...stylelint.rules,
    'color-hex-length': null
  }
};

export { config };
