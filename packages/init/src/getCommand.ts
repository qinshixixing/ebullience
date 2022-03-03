import yargsFn from 'yargs';
import type { Options as YargsOptions } from 'yargs';
import { hideBin } from 'yargs/helpers';

import { allOptions } from './options.js';

const yargs = yargsFn(hideBin(process.argv));

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
const commandOptions: { [key: string]: string } = {};
allOptions.forEach((item) => {
  commandOptions[item.key] = argv[item.key] as string;
});

export { commandOptions };
