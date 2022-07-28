import chalk from 'chalk';
import { getAnswer, runTask } from '@ebullience/init';
import type { Options } from '@ebullience/init';
import { url, branch } from './config.js';

const commandOptions = {
  tplUrl: url,
  tplBranch: branch
};

const answer = await getAnswer(commandOptions);

const options = {
  ...commandOptions,
  ...answer
} as Options.Options;

await runTask(options);

chalk.bold.green('项目初始化完成！');
