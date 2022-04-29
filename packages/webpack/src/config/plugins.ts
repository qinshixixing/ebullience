import path from 'path';
import {
  ProvidePlugin,
  DefinePlugin,
  ProgressPlugin,
  HotModuleReplacementPlugin,
  WebpackPluginInstance,
  EnvironmentPlugin
} from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import ProgressBarWebpackPlugin from 'progress-bar-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// use <WebpackPluginInstance> before "new" because d.ts files are conflict
// d.ts file is wrong
// const WebpackManifestPluginClass = WebpackManifestPlugin.WebpackManifestPlugin;

function getConfig({
  isBuild = true,
  inputFile = [''],
  outputName = '',
  showDetailProgress = false,
  srcDir = '',
  staticDir = '',
  supportIE = false,
  library = false,
  libraryWithStyle = false,
  processEnv = {}
}) {
  const plugins: WebpackPluginInstance[] = [new CleanWebpackPlugin()];

  if (!library) {
    inputFile.forEach((item) => {
      const pathInfo = path.parse(item);
      const name = pathInfo.name;
      const dir = pathInfo.dir;
      const relativePath = path.join(dir, name);
      plugins.push(
        new HtmlWebpackPlugin({
          hash: true,
          inject: 'body',
          minify: true,
          filename: `${relativePath}.html`,
          template: path.resolve(srcDir, `${relativePath}.html`)
        })
      );
    });
  }

  if (!isBuild && supportIE)
    plugins.push(
      new HtmlWebpackTagsPlugin({
        tags: ['https://unpkg.com/core-js@2.6.0/client/core.min.js'],
        append: false,
        publicPath: false
      })
    );

  plugins.push(
    new ESLintWebpackPlugin({
      extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      files: [srcDir],
      failOnError: true,
      emitError: true,
      emitWarning: false,
      failOnWarning: false
    })
  );

  if (!library || libraryWithStyle)
    plugins.push(
      new StylelintWebpackPlugin({
        context: srcDir,
        files: '**/*.(c|sc|sa|le)ss',
        failOnError: true,
        emitError: true,
        emitWarning: false,
        failOnWarning: false
      })
    );

  plugins.push(
    new ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom'
    }),
    new DefinePlugin({}),
    new EnvironmentPlugin(processEnv),
    new WebpackManifestPlugin({})
  );

  const optimizationPlugins: WebpackPluginInstance[] = [];

  if (showDetailProgress) {
    plugins.push(
      new ProgressPlugin((percentage, message, ...args) => {
        console.info(percentage, message, ...args);
      })
    );
  } else {
    plugins.push(<WebpackPluginInstance>new ProgressBarWebpackPlugin());
  }

  if (isBuild) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: `${outputName}.css`,
        chunkFilename: `${outputName}.css`
      })
    );
    if (!library)
      optimizationPlugins.push(
        new TerserWebpackPlugin({
          terserOptions: {
            parse: {
              ecma: 2020
            },
            compress: {
              ecma: 5,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            keep_classnames: isBuild,
            keep_fnames: isBuild,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          }
        }),
        new CssMinimizerWebpackPlugin({
          minimizerOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }]
          }
        })
      );
  } else {
    plugins.push(new HotModuleReplacementPlugin());
  }

  if (staticDir)
    plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: staticDir,
            // to: path.parse(staticDir).name
            to: ''
          }
        ]
      })
    );

  return {
    plugins,
    optimizationPlugins
  };
}

export default getConfig;
