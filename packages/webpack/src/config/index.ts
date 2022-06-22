import path from 'path';
import type {
  Configuration,
  ModuleOptions,
  ResolveOptions,
  EntryObject
} from 'webpack';
import type {
  Configuration as DevServerConfiguration,
  ProxyConfigMap
} from 'webpack-dev-server';
import setOption, { Option } from './option';
import getLoaders from './loaders';
import getPlugins from './plugins';

function getConfig(option: Partial<Option>) {
  const {
    isBuild,
    inputFile,
    outputName,
    rootDir,
    srcDir,
    outputDir,
    staticDir,
    publicPath,
    showDetailProgress,
    host,
    port,
    theme,
    libOnDemand,
    supportIE,
    library,
    libraryName,
    libraryWithStyle,
    lib,
    thirdLib,
    processEnv,
    proxy
  } = setOption(option);

  const allInputFile = Array.isArray(inputFile) ? inputFile : [inputFile];

  const loaders = getLoaders({
    srcDir,
    outputName,
    isBuild,
    theme,
    libOnDemand
  });
  const plugins = getPlugins({
    isBuild,
    inputFile: allInputFile,
    outputName,
    showDetailProgress,
    srcDir,
    staticDir,
    supportIE,
    library,
    libraryWithStyle,
    processEnv
  });

  const module: ModuleOptions = {
    strictExportPresence: true,
    rules: loaders
  };

  const resolve: ResolveOptions = {
    extensions: ['.wasm', '.js', '.ts', '.tsx', '.json'],
    alias: {
      '@@': rootDir,
      '@': srcDir
    }
  };

  const config: Configuration = {
    context: rootDir,
    entry: (() => {
      const data: EntryObject = {};
      const libKeys = Object.keys(lib);
      allInputFile.forEach((name) => {
        const filePath = path.resolve(srcDir, name);
        const fileName = path.parse(filePath).name;
        if (libKeys.length > 0) {
          data[fileName] = {
            import: filePath,
            dependOn: libKeys
          };
        } else data[fileName] = filePath;
      });
      Object.keys(lib).forEach((key) => {
        data[key] = lib[key];
      });
      return data;
    })(),
    output: {
      filename: `${outputName}.js`,
      chunkFilename: `${outputName}.js`,
      path: outputDir,
      publicPath,
      ...(library
        ? {
            library: libraryName || 'MyLibrary',
            libraryTarget: 'umd',
            libraryExport: 'default'
          }
        : {})
    },
    mode: isBuild ? 'production' : 'development',
    devtool: isBuild
      ? library
        ? 'source-map'
        : false
      : 'eval-cheap-module-source-map',
    module,
    resolve,
    plugins: plugins.plugins,
    optimization: library
      ? {
          runtimeChunk: false
        }
      : {
          runtimeChunk: 'single',
          minimizer: plugins.optimizationPlugins,
          splitChunks: {
            chunks: 'all',
            // automaticNameDelimiter: '/',
            minSize: 20000,
            maxSize: 1000000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
              react: {
                test: /node_modules\/react/,
                priority: 20
              },
              antd: {
                test: /node_modules\/antd|@ant-design/,
                priority: 10
              },
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              }
            }
          }
        },
    performance: {
      maxEntrypointSize: 1024000,
      hints: false
    },
    externals: (() => {
      const data: { [propName: string]: { [propName: string]: string } } = {};
      const keys = Object.keys(thirdLib);
      keys.forEach((key) => {
        data[key] = {
          commonjs: key,
          commonjs2: key,
          amd: key,
          root: thirdLib[key]
        };
      });
      return data;
    })(),
    stats: {
      colors: true,
      modules: false,
      children: false
    },
    target: supportIE ? 'browserslist:IE 11' : 'web'
  };

  const devServerConfig: DevServerConfiguration = {
    compress: true,
    hot: true,
    port,
    host,
    historyApiFallback: true,
    // overlay: {
    //   warnings: true,
    //   errors: true
    // },
    open: false,
    liveReload: false,
    static: false,
    proxy: {}
  };

  Object.keys(proxy).forEach((key) => {
    if (!proxy[key]) return;
    (<ProxyConfigMap>devServerConfig.proxy)[key] = {
      target: proxy[key],
      changeOrigin: true,
      pathRewrite: {
        [`^${key}`]: ''
      },
      onProxyRes(proxyRes: any) {
        proxyRes.headers['X-Local-Env-DevServer'] = proxy[key];
      }
    };
  });

  return { config, devServerConfig };
}

module.exports = getConfig;
export default getConfig;
