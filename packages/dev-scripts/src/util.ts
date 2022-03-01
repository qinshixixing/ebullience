import dayjs from 'dayjs';
import chalk from 'chalk';
import { exec, spawn } from 'child_process';
import type { SpawnOptions } from 'child_process';
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

/**
 * 运行任务，包括子进程输入输出
 * @param command 命令
 * @param options 选项
 */
const spawnCommand = (command: string, options?: SpawnOptions) =>
  new Promise((resolve, reject) => {
    const commandArr: ReadonlyArray<string> = command.split(' ');
    const childProcess = spawn(commandArr[0], commandArr.slice(1), {
      ...(options || {}),
      stdio: 'inherit'
    });

    childProcess.on('close', () => {
      resolve('');
    });
    childProcess.on('exit', () => {
      resolve('');
    });
    childProcess.on('error', (code) => {
      reject(`子进程错误，code：${code}`);
    });
  });

export { timeLog, runCommand, spawnCommand };
