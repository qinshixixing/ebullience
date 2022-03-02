import chalk from 'chalk';
import inquirer from 'inquirer';
import { allDir, allOptions } from './options.js';
import type { Options } from './options.js';
import { commandOptions } from './get-command.js';

const currentOptions = allOptions.filter((item) => {
  const value = commandOptions[item.key];

  return !value || (item.commandCheck && !item.commandCheck(value));
});

/**
 * 设置用户交互界面输入
 */
type InquirerConfig = Partial<inquirer.Question & { choices: any }>;
const inquirerConfigList: InquirerConfig[] = [
  {
    name: 'name',
    validate(input: string) {
      input = input.trim();
      if (!input) return Promise.reject(chalk.red.bold('项目名称不能为空！'));
      if (allDir.includes(input))
        return Promise.reject(
          chalk.red.bold('当前目录下该名称文件/文件夹已存在！')
        );
      return true;
    }
  },
  {
    name: 'tplUrl',
    validate(input: string) {
      input = input.trim();
      if (!input)
        return Promise.reject(chalk.red.bold('模版git地址不能为空！'));
      return true;
    }
  },
  {
    name: 'tplBranch',

    validate(input: string) {
      input = input.trim();
      if (!input)
        return Promise.reject(chalk.red.bold('模版git分支不能为空！'));
      return true;
    }
  },
  {
    name: 'author',
    validate(input: string) {
      input = input.trim();
      if (!input) return Promise.reject(chalk.red.bold('作者名称不能为空！'));
      return true;
    }
  }
];

const inquirerList = currentOptions.map((optionConfig) => {
  let inquirerConfig = inquirerConfigList.find(
    (item) => item.name === optionConfig.key
  );
  if (!inquirerConfig) inquirerConfig = { name: optionConfig.key };
  inquirerConfig.type = 'input';
  inquirerConfig.message = `请输入${optionConfig.description}`;
  if (typeof optionConfig.default === 'string')
    inquirerConfig.default = optionConfig.default;

  return inquirerConfig;
});

/**
 * 获取用户交互界面输入
 */
let answer: Partial<Options> = {};
if (inquirerList.length) {
  answer = await inquirer.prompt(inquirerList);
}

export { answer };
