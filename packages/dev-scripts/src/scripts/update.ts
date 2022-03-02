import { updateVersion, generateChangelog, git } from './release.js';

import type { TaskOptions } from '../options.js';

const main = async (options: TaskOptions): Promise<void> => {
  if (!options.name) return;
  if (!options.releaseType) return;

  const version = await updateVersion(options.path, options.releaseType);
  await generateChangelog(options.path, options.name);
  await git(options.path, version, options.name);
};

export { main };
