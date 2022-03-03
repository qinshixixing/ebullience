#!/usr/bin/env node
import chalk from 'chalk';
import type { Options } from './options.js';
import { commandOptions } from './getCommand.js';
import { getAnswer } from './getAnswer.js';
import { main as runTask } from './runTask.js';

const answer = await getAnswer(commandOptions);
const options: Options = {
  ...commandOptions,
  ...answer
} as Options;

await runTask(options);

chalk.bold.green('项目初始化完成！');
