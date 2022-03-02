import { TransformOptions } from '@babel/core';
import { LibraryImport } from '../option';

function getConfig({
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
        }
      ]
    ]
  };
  if (isSrc) {
    config.presets?.push(
      [
        '@babel/preset-react',
        {
          useBuiltIns: 'usage',
          development: !isBuild
        }
      ],
      [
        '@babel/typescript',
        {
          isTSX: true,
          allExtensions: true,
          onlyRemoveTypeImports: true
        }
      ]
    );
  } else {
    config.babelrc = config.configFile = false;
  }
  return config;
}

module.exports = getConfig;
export default getConfig;
