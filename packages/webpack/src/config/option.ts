import path from 'path';
import { Configuration } from 'webpack';

export interface LibraryImport {
  libraryName: string;
  libraryDirectory: string;
  style: true | 'css';
}

export interface Option {
  isBuild: boolean;
  inputFile: string | string[];
  outputName: string;
  rootDir: string;
  srcDir: string;
  staticDir: string;
  outputDir: string;
  publicPath: string | (() => string);
  showDetailProgress: boolean;
  host: string;
  port: string;
  theme: Record<string, string | number>;
  libOnDemand: Partial<LibraryImport>[];
  supportIE: boolean;
  library: boolean;
  libraryName: string;
  libraryWithStyle: boolean;
  internalLib: Record<string, string>;
  externalLib: Record<string, string>;
  compileLib: string[];
  processEnv: Record<string, any>;
  proxy: { [propName: string]: string };
  extend?: (config?: Configuration) => Configuration;
}

const defaultOption: Option = {
  isBuild: false,
  inputFile: '',
  outputName: '',
  rootDir: process.cwd(),
  srcDir: 'src',
  staticDir: 'static',
  outputDir: 'dist',
  publicPath: '',
  showDetailProgress: false,
  host: '0.0.0.0',
  port: '8888',
  theme: {},
  libOnDemand: [],
  supportIE: false,
  library: false,
  libraryName: '',
  libraryWithStyle: false,
  internalLib: {},
  externalLib: {},
  compileLib: [],
  processEnv: {},
  proxy: {}
};

function setOption(option: Partial<Option>) {
  const totalOption = {
    ...defaultOption,
    ...option
  };
  if (!totalOption.outputName)
    totalOption.outputName =
      totalOption.isBuild && !totalOption.library
        ? '[name].[contenthash]'
        : '[name]';
  type contentDir = 'srcDir' | 'staticDir' | 'outputDir';
  const content: contentDir[] = ['srcDir', 'staticDir', 'outputDir'];
  content.forEach((key) => {
    totalOption[key] = path.resolve(totalOption.rootDir, totalOption[key]);
  });
  if (!totalOption.inputFile) {
    totalOption.inputFile = totalOption.library ? 'index.ts' : 'index.tsx';
  }
  if (totalOption.isBuild) {
    totalOption.publicPath =
      totalOption.publicPath || (totalOption.library ? './' : '/');
  } else totalOption.publicPath = '/';
  if (totalOption.library) {
    totalOption.externalLib = {
      ...totalOption.externalLib,
      react: 'React',
      'react-dom': 'ReactDOM'
    };
  }
  return totalOption;
}

export default setOption;
