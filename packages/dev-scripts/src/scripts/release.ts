import semver from 'semver';
import type { ReleaseType } from 'semver';
import fsExtra from 'fs-extra';
import { resolve } from 'path';

import type { TaskOptions } from '../options.js';
import { timeLog, runCommand } from '../util.js';

const { readJSON, writeJSON } = fsExtra;

/**
 * 更新版本号
 * @param path 包路径
 * @param releaseType 发布类型
 */
export const updateVersion = async (path: string, releaseType: ReleaseType) => {
  const label = '更新package.json版本号';
  timeLog(label, 'start');
  const pkgPath = resolve(path, 'package.json');
  const pkg = await readJSON(pkgPath);
  pkg.version = semver.inc(pkg.version, releaseType);
  await writeJSON(pkgPath, pkg, {
    spaces: 2
  });
  timeLog(label, 'end');
  return pkg.version;
};

/**
 * 生成CHANGELOG
 * @param path 包路径
 * @param tagPrefix 读取提交内容的git tag prefix
 */
export const generateChangelog = async (path: string, tagPrefix: string) => {
  const label = '生成CHANGELOG';
  timeLog(label, 'start');
  const logPath = resolve(path, 'CHANGELOG.md');
  const pkgPath = resolve(path, 'package.json');
  await runCommand(
    `conventional-changelog -p angular -k ${pkgPath} --commit-path ${path} -t ${tagPrefix}/ -i ${logPath} -s -r 0`
  );
  timeLog(label, 'end');
};

/**
 * 发布
 * @param path 包路径
 */
const publish = async (path: string) => {
  const label = '发布至npm仓库';
  timeLog(label, 'start');
  await runCommand(`npm publish ${path} --access=public`);
  timeLog(label, 'end');
};

/**
 * git操作
 * @param path 包路径
 * @param version 版本
 * @param tagPrefix 提交内容的git tag prefix
 */
export const git = async (path: string, version: string, tagPrefix: string) => {
  const label = '提交推送代码至git仓库';
  timeLog(label, 'start');
  const logPath = resolve(path, 'CHANGELOG.md');
  const pkgPath = resolve(path, 'package.json');
  const tagName = `${tagPrefix}/v${version}`;
  await runCommand(`git add ${pkgPath} ${logPath}`);
  await runCommand(`git commit -m "${tagName}" -n`);
  await runCommand(`git tag ${tagName}`);
  await runCommand('git push');
  await runCommand(`git push origin tag ${tagName}`);
  timeLog(label, 'end');
};

const main = async (options: TaskOptions): Promise<void> => {
  if (!options.name) return;
  if (!options.releaseType) return;

  const version = await updateVersion(options.path, options.releaseType);
  await generateChangelog(options.path, options.name);
  await publish(options.path);
  await git(options.path, version, options.name);
};

export { main };
