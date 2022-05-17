import { RuleSetUse } from 'webpack';
import postcssConfig from './postcss';
import { loader } from 'mini-css-extract-plugin';

function getConfig({
  modules = true,
  isBuild = true,
  preType = '',
  theme = {}
}) {
  const styleLoader = isBuild
    ? {
        loader,
        options: {
          publicPath: isBuild ? './' : '/'
        }
      }
    : 'style-loader';

  const cssLoaderIndex = 1;
  const cssLoader = {
    loader: 'css-loader',
    options: {
      modules: modules
        ? {
            localIdentName: '[local]_[hash:base64]'
          }
        : false,
      importLoaders: 0
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: postcssConfig
    }
  };

  const resolveUrlLoader = 'resolve-url-loader';

  const lessLoader = {
    loader: 'less-loader',
    options: {
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: theme,
        sourceMap: true
      }
    }
  };

  const sassLoader = {
    loader: 'sass-loader',
    options: {
      sourceMap: true
    }
  };

  const config: RuleSetUse = [styleLoader, cssLoader, postcssLoader];
  if (preType) {
    config.push(resolveUrlLoader);
    switch (preType) {
      case 'less':
        config.push(lessLoader);
        break;
      case 'sass':
        config.push(sassLoader);
        break;
      default:
    }
  }
  cssLoader.options.importLoaders = config.length - cssLoaderIndex - 1;
  return config;
}

module.exports = getConfig;
export default getConfig;
