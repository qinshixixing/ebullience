import { Config } from 'stylelint';

const config: Partial<Config> = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-standard-scss',
    'stylelint-config-prettier'
  ],
  plugins: ['stylelint-css-modules'],
  customSyntax: 'postcss-less',
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
