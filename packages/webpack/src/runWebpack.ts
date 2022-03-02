import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getWebpackConfig from './config';
import { Option } from './config/option';

function runWebpack(config: Partial<Option>) {
  const allConfig = getWebpackConfig(config);
  // two ts store conflict
  let webpackConfig = allConfig.config;
  if (typeof config.extend === 'function') {
    webpackConfig = config.extend(webpackConfig);
  }
  const devServerConfig = {
    ...allConfig.devServerConfig,
    // eslint-disable-next-line
    // @ts-ignore
    ...webpackConfig.devServer
  };

  const { isBuild } = config;

  // two ts store conflict
  const compiler = webpack(webpackConfig);

  if (isBuild) {
    // ignore
    compiler.run((err: any, stats: any) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }
      const info = stats.toJson();
      if (stats.hasErrors()) {
        console.error(info.errors);
      }
      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
      console.log(stats.toString(webpackConfig.stats));
    });
  } else {
    const server = new WebpackDevServer(compiler, devServerConfig);
    server.listen(
      <number>devServerConfig.port,
      <string>devServerConfig.host,
      () => null
    );
  }
}

export default runWebpack;
