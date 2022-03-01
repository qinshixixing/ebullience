import { stat, readFile, readdir, mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';

import type { TaskOptions } from '../options.js';
import { timeLog } from '../util.js';

/**
 * 检查模版文件
 */
const checkTemplatePath = async () => {
  const label = '检查模版文件';
  timeLog(label, 'start');

  const currentUrl = fileURLToPath(import.meta.url);
  const defaultPath = resolve(currentUrl, '../../../template');
  const userPath = resolve(process.cwd(), 'template');
  const inputPath = '';
  const paths = [inputPath, userPath, defaultPath];

  const check = async (pathIndex: number): Promise<string> => {
    if (pathIndex === paths.length) return '';
    const path = paths[pathIndex];
    let result;
    if (!path) result = false;
    else
      try {
        const stats = await stat(path);
        result = stats.isDirectory();
      } catch (e) {
        result = false;
      }
    if (result) return path;
    return await check(pathIndex + 1);
  };
  const tplPath = await check(0);

  timeLog(label, 'end');
  return tplPath;
};

/**
 * 生成项目文件
 */
const generateFiles = async (tplPath: string, options: TaskOptions) => {
  const label = '生产项目文件';
  timeLog(label, 'start');

  await mkdir(`${options.newPath}`);

  const handleFiles = async (dir: string, outDir: string) => {
    const files = await readdir(dir);
    await Promise.all(
      files.map(async (file) => {
        const filePath = `${dir}/${file}`;
        const stats = await stat(filePath);
        if (stats.isDirectory()) {
          const dirPath = `${outDir}/${file}`;
          await mkdir(dirPath);
          await handleFiles(filePath, dirPath);
        } else {
          const fileContent = await readFile(filePath, {
            encoding: 'utf8'
          });
          const template = handlebars.compile(fileContent);
          const outputContent = template({
            name: options.newName,
            author: options.author,
            description: options.description,
            isCommonjs:
              options.project === 'web' || options.module === 'commonjs',
            isWeb: options.project === 'web'
          });
          await writeFile(`${outDir}/${file}`, outputContent, {
            encoding: 'utf8'
          });
        }
      })
    );
  };

  await handleFiles(tplPath, options.newPath);
  timeLog(label, 'end');
};

const main = async (options: TaskOptions): Promise<void> => {
  if (!options.newName) return;
  options.author = options.author || '';
  options.description = options.description || '';

  const tplPath = await checkTemplatePath();
  if (!tplPath) {
    console.error('无模版文件！');
    return;
  }
  await generateFiles(tplPath, options);
};

export { main };
