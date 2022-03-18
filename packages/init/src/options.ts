import { readdir } from 'fs/promises';
import { resolve } from 'path';

export interface Options {
  name: string;
  tplUrl: string;
  tplBranch: string;
  author: string;
  description: string;
}

export type Option = keyof Options;

export interface OptionConfig {
  key: Option;
  description: string;
  alias?: string;
  default?: string;
  choices?: string[];
  commandCheck?: (value: string) => boolean;
}

let allDir: string[] = [];
try {
  allDir = await readdir(resolve(process.cwd()));
  // eslint-disable-next-line no-empty
} catch (e) {}
export { allDir };

export const allOptions: OptionConfig[] = [
  {
    key: 'name',
    description: '项目名称',
    commandCheck: (value) => !allDir.includes(value)
  },
  {
    key: 'tplUrl',
    description: '模版git地址'
  },
  {
    key: 'tplBranch',
    description: '模版git分支',
    default: 'master'
  },
  {
    key: 'author',
    description: '作者名称'
  },
  {
    key: 'description',
    description: '项目描述'
  }
];

export const removePath: string[] = ['.git'];
