import path from 'path';
import type { Configuration, ModuleOptions, ResolveOptions } from 'webpack';
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
    thirdLib,
    processEnv,
    proxy
  } = setOption(option);

  const loaders = getLoaders({
    srcDir,
    outputName,
    isBuild,
    theme,
    libOnDemand
  });
  const plugins = getPlugins({
    isBuild,
    inputFile,
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
    entry: {
      index: path.resolve(srcDir, inputFile)
    },
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
            cacheGroups: {
              react: {
                test: /node_modules\/react/,
                priority: 10
              },
              antd: {
                test: /node_modules\/(antd|@ant-design)/,
                priority: 10
              },
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
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
