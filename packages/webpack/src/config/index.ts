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
    aliasDir,
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
    externalLib,
    internalLib,
    compileLib,
    processEnv,
    proxy,
    gzipOnly,
    chunkMaxSize
  } = setOption(option);

  const allInputFile = Array.isArray(inputFile) ? inputFile : [inputFile];

  const loaders = getLoaders({
    rootDir,
    srcDir,
    staticDir,
    outputName,
    isBuild,
    theme,
    compileLib,
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
    processEnv,
    gzipOnly
  });

  const chunkMaxSizeValue = chunkMaxSize * 1000;

  const module: ModuleOptions = {
    strictExportPresence: true,
    rules: loaders
  };

  const resolve: ResolveOptions = {
    extensions: ['.wasm', '.js', '.ts', '.tsx', '.json'],
    alias: (() => {
      const data: Record<string, string> = {
        '@@': rootDir,
        '@': srcDir
      };
      Object.keys(aliasDir).forEach((key) => {
        data[key] = path.resolve(rootDir, aliasDir[key]);
      });
      return data;
    })()
  };

  const config: Configuration = {
    context: rootDir,
    entry: (() => {
      const data: EntryObject = {};
      const libConfig: Record<string, string[]> = {};
      Object.keys(internalLib).forEach((key) => {
        const libName = internalLib[key] || 'vendor';
        if (!libConfig[libName]) libConfig[libName] = [];
        libConfig[libName].push(key);
      });
      const libNameKeys = Object.keys(libConfig);
      libNameKeys.forEach((key) => {
        data[key] = libConfig[key];
      });
      allInputFile.forEach((name) => {
        const filePath = path.resolve(srcDir, name);
        const fileName = path.parse(filePath).name;
        data[fileName] =
          libNameKeys.length > 0
            ? {
                import: filePath,
                dependOn: libNameKeys
              }
            : filePath;
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
            minSize: 20000,
            maxSize: chunkMaxSizeValue,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 35,
            maxInitialRequests: 35,
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
      maxEntrypointSize: chunkMaxSizeValue,
      maxAssetSize: chunkMaxSizeValue,
      hints: false
    },
    externals: (() => {
      const data: Record<string, Record<string, string> | string> = {};
      const keys = Object.keys(externalLib);
      keys.forEach((key) => {
        data[key] = library
          ? {
              commonjs: key,
              commonjs2: key,
              amd: key,
              root: externalLib[key]
            }
          : `var ${externalLib[key]}`;
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
