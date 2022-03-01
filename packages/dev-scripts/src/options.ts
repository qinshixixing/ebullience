import type { ReleaseType } from 'semver';
import { readdir } from 'fs/promises';
import { resolve } from 'path';

export type TaskType =
  | 'new'
  | 'build'
  | 'commit'
  | 'commit-all'
  | 'release'
  | 'release-all';

export type ProjectType = 'web' | 'node';

export type ModuleType = 'es' | 'commonjs';

export interface Options {
  newName: string;
  name: string;
  module: ModuleType;
  project: ProjectType;
  author: string;
  description: string;
  releaseType: ReleaseType;
}

export interface TaskOptions extends Options {
  path: string;
  newPath: string;
}

export type Option = keyof Options;

export interface CommandConfig {
  key: TaskType;
  description: string;
  options: Option[];
}

export interface OptionConfig {
  key: Option;
  description: string;
  alias?: string;
  default?: string;
  choices?: string[];
  commandCheck?: (value: string) => boolean;
}

export const allReleaseType: ReleaseType[] = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease'
];

export const allModuleType: ModuleType[] = ['es', 'commonjs'];

export const allProjectType: ProjectType[] = ['web', 'node'];

let allPackage: string[] = [];
try {
  allPackage = await readdir(resolve(process.cwd(), 'packages'));
  // eslint-disable-next-line no-empty
} catch (e) {}
export { allPackage };

export const allCommand: CommandConfig[] = [
  {
    key: 'new',
    description: '新建一个项目',
    options: ['newName', 'project', 'module', 'author', 'description']
  },
  {
    key: 'build',
    description: '编译ts代码',
    options: ['name']
  },
  {
    key: 'commit',
    description: '按照规范提交代码至git仓库',
    options: ['name']
  },
  {
    key: 'commit-all',
    description: '按照规范提交所有代码至git仓库',
    options: []
  },
  {
    key: 'release',
    description: '发布包至npm仓库',
    options: ['name', 'releaseType']
  },
  {
    key: 'release-all',
    description: '更新整个git仓库版本并打tag',
    options: ['releaseType']
  }
];

export const allOptions: OptionConfig[] = [
  {
    key: 'newName',
    description: '包名称',
    commandCheck: (value) => !allPackage.includes(value)
  },
  {
    key: 'name',
    description: '包名称',
    choices: allPackage
  },
  {
    key: 'project',
    description: '项目类型',
    choices: allProjectType
  },
  {
    key: 'module',
    description: '模块类型',
    choices: allModuleType
  },
  {
    key: 'author',
    description: '作者名称'
  },
  {
    key: 'description',
    description: '包描述'
  },
  {
    key: 'releaseType',
    description: '版本类型',
    choices: allReleaseType
  }
];
