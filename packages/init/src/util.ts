import dayjs from 'dayjs';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

/**
 * 打印
 * @param info 信息
 * @param type 类型
 */
const timeLog = (info: string, type: 'start' | 'end'): void => {
  const titleMsg = type === 'start' ? '✨ 开始任务：' : '✨ 结束任务：';
  const timeMsg = `${dayjs().format('YYYY/MM/DD HH:mm:ss SSS')}ms`;

  const msg = `${titleMsg}${chalk.green(info)}  ${timeMsg}`;
  console.info(chalk.bold(msg));
};

/**
 * 运行任务
 */
const runCommand = promisify(exec);

export { timeLog, runCommand };
