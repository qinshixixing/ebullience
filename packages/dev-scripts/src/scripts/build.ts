import { resolve } from 'path';
import fsExtra from 'fs-extra';

import type { TaskOptions } from '../options.js';
import { timeLog, runCommand } from '../util.js';

const { readJSON, remove } = fsExtra;

/**
 * 打包
 * @param path 包路径
 */
const build = async (path: string) => {
  const label = '打包代码';
  timeLog(label, 'start');
  const tsconfigPath = resolve(path, 'tsconfig.json');
  const config = await readJSON(tsconfigPath);
  const outputDir = config.compilerOptions.outDir || 'dist';
  await remove(resolve(path, outputDir));
  await runCommand(`tsc -p ${tsconfigPath}`);
  timeLog(label, 'end');
};

const main = async (options: TaskOptions): Promise<void> => {
  if (!options.name) return;

  await build(options.path);
};

export { main };
