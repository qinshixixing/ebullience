import { resolve } from 'path';
import chalk from 'chalk';
import fsExtra from 'fs-extra';
import inquirer from 'inquirer';
import semver from 'semver';

import {
  allPackage,
  allReleaseType,
  allCommand,
  allOptions
} from './options.js';
import type {
  Options,
  OptionConfig,
  ProjectType,
  CommandConfig
} from './options.js';
import { command, commandOptions } from './get-command.js';

const { readJSON } = fsExtra;

let pkgInfo: any;

/**
 * 根据命令行获取当前配置项
 */
const commandConfig = allCommand.find(
  (item) => item.key === command
) as CommandConfig;
const currentOptions: OptionConfig[] = [];
commandConfig.options.forEach((option) => {
  const optionConfig = allOptions.find(
    (item) => item.key === option
  ) as OptionConfig;

  const value = commandOptions[option];

  if (
    !value ||
    (optionConfig.commandCheck && !optionConfig.commandCheck(value))
  )
    currentOptions.push(optionConfig);
});

/**
 * 设置用户交互界面输入
 */
type InquirerConfig = Partial<inquirer.Question & { choices: any }>;
const inquirerConfigList: InquirerConfig[] = [
  {
    name: 'newName',
    validate(input: string) {
      input = input.trim();
      if (!input) return Promise.reject(chalk.red.bold('包名称不能为空！'));
      if (allPackage.includes(input))
        return Promise.reject(chalk.red.bold('包名称已存在！'));
      return true;
    }
  },
  {
    name: 'module',
    when: (answer: inquirer.Answers) => {
      const project: ProjectType = answer.project || commandOptions.project;
      return project === 'node';
    }
  },
  {
    name: 'author',
    validate(input: string) {
      input = input.trim();
      if (!input) return Promise.reject(chalk.red.bold('作者名称不能为空！'));
      return true;
    }
  },
  {
    name: 'releaseType',
    message: async (answers: inquirer.Answers) => {
      if (!pkgInfo) {
        const pkgName: string = answers.name || commandOptions.name || '';
        pkgInfo = await readJSON(
          resolve(
            process.cwd(),
            pkgName ? `packages/${pkgName}/package.json` : 'package.json'
          )
        );
      }
      return `请选择将要发布的版本 (当前版本${pkgInfo.version} )：`;
    },
    choices: async (answers: inquirer.Answers) => {
      if (!pkgInfo) {
        const pkgName: string = answers.name || commandOptions.name || '';
        pkgInfo = await readJSON(
          resolve(
            process.cwd(),
            pkgName ? `packages/${pkgName}/package.json` : 'package.json'
          )
        );
      }
      return allReleaseType.map((item) => ({
        name: `${item} => ${semver.inc(pkgInfo.version, item)}`,
        value: item
      }));
    }
  }
];

const inquirerList = currentOptions.map((optionConfig) => {
  let inquirerConfig = inquirerConfigList.find(
    (item) => item.name === optionConfig.key
  );
  if (!inquirerConfig) inquirerConfig = { name: optionConfig.key };

  if (!inquirerConfig.type)
    inquirerConfig.type = optionConfig.choices ? 'list' : 'input';
  if (!inquirerConfig.message)
    inquirerConfig.message = `${optionConfig.choices ? '请选择' : '请输入'}${
      optionConfig.description
    }：`;
  if (!inquirerConfig.choices && optionConfig.choices)
    inquirerConfig.choices = optionConfig.choices;

  return inquirerConfig;
});

/**
 * 获取用户交互界面输入
 */
let answer: Partial<Options> = {};
if (inquirerList.length)
  answer = (await inquirer.prompt(inquirerList)) as Partial<Options>;

export { answer };
