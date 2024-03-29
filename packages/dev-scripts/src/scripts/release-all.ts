import fsExtra from 'fs-extra';
import { resolve } from 'path';

import type { TaskOptions } from '../options.js';
import { updateVersion, generateChangelog, git, publish } from './release.js';

const { readJSON } = fsExtra;

const main = async (options: TaskOptions): Promise<void> => {
  if (!options.releaseType) return;

  const version = await updateVersion(options.path, options.releaseType);

  const pkgPath = resolve(process.cwd(), 'package.json');
  const pkg = await readJSON(pkgPath);
  await generateChangelog(options.path, pkg.name);
  await publish(options.path);
  await git(options.path, version, pkg.name);
};

export { main };
