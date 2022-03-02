import type { ReleaseType } from 'semver';
import { readdir } from 'fs/promises';
import { resolve } from 'path';

export type TaskType =
  | 'new'
  | 'build'
  | 'build-all'
  | 'commit'
  | 'commit-all'
  | 'release'
  | 'release-all'
  | 'update'
  | 'update-all';

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
    description: '新建一个项目(包)',
    options: ['newName', 'project', 'module', 'author', 'description']
  },
  {
    key: 'build',
    description: '编译包ts代码',
    options: ['name']
  },
  {
    key: 'build-all',
    description: '编译整个项目ts代码',
    options: []
  },
  {
    key: 'commit',
    description: '按照规范提交包代码至git仓库',
    options: ['name']
  },
  {
    key: 'commit-all',
    description: '按照规范提交整个项目代码至git仓库',
    options: []
  },
  {
    key: 'release',
    description: '发布包至npm仓库',
    options: ['name', 'releaseType']
  },
  {
    key: 'release-all',
    description: '发布整个项目至npm仓库',
    options: ['releaseType']
  },
  {
    key: 'update',
    description: '更新包的发布信息(生成CHANGELOG、更新版本号、打tag)',
    options: ['name', 'releaseType']
  },
  {
    key: 'update-all',
    description: '更新整个项目的发布信息(生成CHANGELOG、更新版本号、打tag)',
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
