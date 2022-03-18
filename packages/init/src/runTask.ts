import { stat, readFile, readdir, mkdir, writeFile } from 'fs/promises';
import { remove } from 'fs-extra';
import handlebars from 'handlebars';
import { removePath } from './options.js';
import type { Options } from './options.js';
import { timeLog, runCommand } from './util.js';

/**
 * 生产项目文件夹
 */
const mkDir = async (name: string): Promise<string> => {
  const label = '生产项目文件夹';
  timeLog(label, 'start');
  const dirPath = `${process.cwd()}/${name}`;
  await mkdir(dirPath);
  timeLog(label, 'end');
  return dirPath;
};

/**
 * 下载文件
 */
const downloadFiles = async (
  tplUrl: string,
  tplBranch: string,
  path: string
): Promise<void> => {
  const label = '下载文件';
  timeLog(label, 'start');
  await runCommand(`git clone -b ${tplBranch} ${tplUrl} ${path}`);
  timeLog(label, 'end');
};

/**
 * 处理文件
 */
const handleFiles = async (path: string, options: Options) => {
  const label = '处理文件';
  timeLog(label, 'start');
  const task = async (dir: string, compile?: boolean) => {
    const files = await readdir(dir);
    await Promise.all(
      files.map(async (file) => {
        const filePath = `${dir}/${file}`;
        const stats = await stat(filePath);
        if (removePath.includes(file)) await remove(filePath);
        else if (stats.isDirectory()) {
          await task(filePath, false);
        } else if (compile) {
          const fileContent = await readFile(filePath, {
            encoding: 'utf8'
          });
          const template = handlebars.compile(fileContent);
          const outputContent = template({
            name: options.name,
            author: options.author,
            description: options.description
          });
          await writeFile(filePath, outputContent, {
            encoding: 'utf8'
          });
        }
      })
    );
  };
  await task(path, true);
  timeLog(label, 'end');
};

const main = async (options: Options): Promise<void> => {
  const path = await mkDir(options.name);

  await downloadFiles(options.tplUrl, options.tplBranch, path);
  await handleFiles(path, options);
};

export { main };
