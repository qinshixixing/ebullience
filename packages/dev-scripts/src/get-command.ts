import yargsFn from 'yargs';
import type { Options as YargsOptions } from 'yargs';
import { hideBin } from 'yargs/helpers';

import { allCommand, allOptions } from './options.js';
import type { TaskType } from './options.js';

const yargs = yargsFn(hideBin(process.argv));

/**
 * 设置命令
 */
yargs.demandCommand(1, '至少需要一个额外命令');
allCommand.forEach((item) => {
  yargs.command(item.key, item.description);
});

/**
 * 设置参数
 */
const yargsOptions: { [key: string]: YargsOptions } = {};
allOptions.forEach((item) => {
  const option: YargsOptions = {
    describe: item.description,
    type: 'string'
  };
  if (item.alias) option.alias = item.alias;
  if (item.choices) option.choices = item.choices;
  yargsOptions[item.key] = option;
});
yargs.options(yargsOptions);

yargs.strict();
const argv = yargs.locale('zh_CN').argv as {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
};

/**
 * 获取命令行输入
 */
const command: TaskType = argv._[0] as TaskType;
const commandOptions: { [key: string]: string } = {};
allOptions.forEach((item) => {
  commandOptions[item.key] = argv[item.key] as string;
});

export { command, commandOptions };
