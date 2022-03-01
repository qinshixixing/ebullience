import type { TaskOptions } from '../options.js';
import { commit } from './commit.js';

const main = async (options: TaskOptions): Promise<void> => {
  await commit();
};

export { main };
