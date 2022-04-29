import { TransformOptions } from '@babel/core';
import { LibraryImport } from '../option';

function getConfig({
  type = 'js',
  isSrc = true,
  isBuild = true,
  libOnDemand = <Partial<LibraryImport>[]>[]
}) {
  const config: TransformOptions = {
    compact: isSrc ? isBuild : false,
    presets: [['@babel/preset-env']],
    plugins: [
      ...libOnDemand.map((item) => [['import', item, item.libraryName]]),
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 3,
          helpers: true,
          regenerator: true,
          useESModules: true
        },
        [
          '@babel/preset-react',
          {
            useBuiltIns: 'usage',
            development: !isBuild
          }
        ]
      ]
    ]
  };
  if (type !== 'js' || isSrc) {
    config.presets?.push([
      '@babel/preset-react',
      {
        useBuiltIns: 'usage',
        development: !isBuild
      }
    ]);
  } else {
    config.babelrc = config.configFile = config.compact = false;
  }
  if (type === 'ts') {
    config.presets?.push([
      '@babel/typescript',
      {
        isTSX: false,
        allExtensions: false,
        onlyRemoveTypeImports: true
      }
    ]);
  }
  return config;
}

module.exports = getConfig;
export default getConfig;
