import chalk from 'chalk';
import type { Options } from './options.js';
import { commandOptions } from './input/get-command.js';
import { answer } from './input/get-answer.js';
import { main as runTask } from './run-task.js';

const options: Options = {
  ...commandOptions,
  ...answer
} as Options;

await runTask(options);

chalk.bold.green('项目初始化完成！');
