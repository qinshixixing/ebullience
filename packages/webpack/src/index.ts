import getConfig from './input/getConfig';
import runWebpack from './runWebpack';
import { allTaskType, TaskType } from './taskType';

async function main(taskType: TaskType, configPath = 'build.config.js') {
  if (!allTaskType.includes(taskType)) throw new Error('"taskType" is wrong!');
  let isBuild: boolean;
  switch (taskType) {
    case 'build':
      process.env.NODE_ENV = 'production';
      isBuild = true;
      break;
    case 'dev':
      process.env.NODE_ENV = 'development';
      isBuild = false;
      break;
  }

  const config = await getConfig(configPath);
  config.isBuild = isBuild;
  runWebpack(config);
}

module.exports = main;
export default main;
