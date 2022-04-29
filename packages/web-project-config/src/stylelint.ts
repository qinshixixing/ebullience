import { Config } from 'stylelint';

const config: Partial<Config> = {
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
  },
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
      rules: {
        'selector-class-pattern': [
          '^([a-z][a-zA-Z0-9]*)(-[a-zA-Z0-9]+)*$',
          {
            message: 'Expected id selector to be kebab-case'
          }
        ],
        'selector-id-pattern': [
          '^([a-z][a-zA-Z0-9]*)(-[a-zA-Z0-9]+)*$',
          {
            message: 'Expected id selector to be kebab-case'
          }
        ]
      }
    },
    { files: ['**/*.scss'], extends: ['stylelint-config-standard-scss'] }
  ]
};

export { config };
