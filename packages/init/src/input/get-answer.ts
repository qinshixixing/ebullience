import inquirer from 'inquirer';
import type { Options } from '../options.js';
import { commandOptions } from './get-command.js';
import { getInquirerConfig } from './inquirer-config.js';

const inquirerList = getInquirerConfig(commandOptions);

/**
 * 获取用户交互界面输入
 */
let answer: Partial<Options> = {};
if (inquirerList.length) {
  answer = await inquirer.prompt(inquirerList);
}

export { answer };
