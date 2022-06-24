import { RuleSetRule } from 'webpack';
import getBabelLoader from './babel';
import getStyleLoader from './style';
import { LibraryImport } from './option';

function getConfig({
  srcDir = 'src',
  outputName = '',
  isBuild = true,
  theme = {},
  compileLib = <string[]>[],
  libOnDemand = <Partial<LibraryImport>[]>[]
}) {
  const parseLoaders = [
    {
      test: /\.js$/,
      include: [srcDir, ...compileLib.map((item) => `node_modules/${item}`)],
      use: getBabelLoader({ type: 'js', isSrc: true, isBuild, libOnDemand })
    },
    {
      test: /\.(mjs|mjsx|jsx)$/,
      exclude: /@babel(?:\/|\\{1,2})runtime/,
      use: getBabelLoader({ type: 'mjs', isSrc: false, isBuild, libOnDemand })
    },
    {
      test: /\.tsx?$/,
      exclude: /@babel(?:\/|\\{1,2})runtime/,
      use: getBabelLoader({ type: 'ts', isSrc: false, isBuild, libOnDemand })
    },
    {
      test: /\.(?<!global\.)css$/,
      include: srcDir,
      use: getStyleLoader({ modules: true, isBuild, theme })
    },
    {
      test: /\.global\.css$/,
      include: srcDir,
      use: getStyleLoader({ modules: false, isBuild, theme })
    },
    {
      test: /\.css$/,
      exclude: srcDir,
      use: getStyleLoader({ modules: false, isBuild, theme })
    },
    {
      test: /\.(?<!global\.)(sa|sc)ss$/,
      include: srcDir,
      use: getStyleLoader({ modules: true, preType: 'sass', isBuild, theme })
    },
    {
      test: /\.global\.(sa|sc)ss$/,
      include: srcDir,
      use: getStyleLoader({ modules: false, preType: 'sass', isBuild, theme })
    },
    {
      test: /\.(sa|sc)ss$/,
      exclude: srcDir,
      use: getStyleLoader({ modules: false, preType: 'sass', isBuild, theme })
    },
    {
      test: /\.(?<!global\.)less$/,
      include: srcDir,
      use: getStyleLoader({ modules: true, preType: 'less', isBuild, theme })
    },
    {
      test: /\.global\.less$/,
      include: srcDir,
      use: getStyleLoader({ modules: false, preType: 'less', isBuild, theme })
    },
    {
      test: /\.less$/,
      exclude: srcDir,
      use: getStyleLoader({ modules: false, preType: 'less', isBuild, theme })
    },
    {
      test: /\.(jpe?g|png|svg|gif|bmp|woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: `image/${outputName}.[ext]`
          }
        }
      ]
    },
    {
      loader: 'file-loader',
      exclude: [
        /\.(js|ts)x?$/,
        /\.(mjs|cjs)$/,
        /\.(c|le|sa|sc|)ss$/,
        /\.json$/,
        /\.html$/
      ],
      options: {
        name: `file/${outputName}.[ext]`
      }
    }
  ];

  const loaders: RuleSetRule[] = [
    {
      oneOf: parseLoaders
    }
  ];

  return loaders;
}

export default getConfig;
