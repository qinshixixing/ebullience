import type { TaskOptions } from '../options.js';
import { timeLog, runCommand, spawnCommand } from '../util.js';

/**
 * 提交代码
 * @param path 包路径
 */
const commit = async (path?: string): Promise<void> => {
  const label = '提交代码';
  timeLog(label, 'start');
  await runCommand(`git add ${path || '.'}`);
  await spawnCommand('git cz');
  await runCommand('git push');
  timeLog(label, 'end');
};

const main = async (options: TaskOptions): Promise<void> => {
  if (!options.name) return;

  await commit(options.path);
};

export { main, commit };
