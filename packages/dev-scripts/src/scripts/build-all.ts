import type { TaskOptions } from '../options.js';
import { build } from './build.js';

const main = async (options: TaskOptions): Promise<void> => {
  await build(options.path);
};

export { main };
