import { TransformOptions } from '@babel/core';
import getBabelConfig from './config';
import { LibraryImport } from '../option';

interface LoaderOptions extends TransformOptions {
  cacheDirectory: boolean;
  cacheCompression: boolean;
}

function getConfig({
  type = 'js',
  isSrc = true,
  isBuild = true,
  libOnDemand = <Partial<LibraryImport>[]>[]
}) {
  const babelConfig = getBabelConfig({ type, isSrc, isBuild, libOnDemand });
  const options: LoaderOptions = {
    cacheDirectory: true,
    cacheCompression: false,
    ...babelConfig
  };
  return {
    loader: 'babel-loader',
    options
  };
}

module.exports = getConfig;
export default getConfig;
