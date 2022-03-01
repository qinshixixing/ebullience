import { Configuration } from 'stylelint';

const config: Partial<Configuration> = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-prettier'
  ],
  plugins: ['stylelint-css-modules'],
  rules: {
    'css-modules/composed-class-names': true,
    'css-modules/css-variables': [
      true,
      {
        resolve: {
          extensions: ['.css', '.scss', '.less'],
          modules: ['node_modules', 'src']
        }
      }
    ],
    'selector-list-comma-space-after': 'always-single-line'
  }
};

export { config };
