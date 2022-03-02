import { Options } from 'prettier';
import { prettier } from '@ebullience/web-project-config';

const config: Options = {
  ...prettier,
  semi: false
};

export { config };
