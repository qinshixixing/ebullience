import { resolve } from 'path';
import type { Options, TaskOptions } from './options.js';
import { command, commandOptions } from './get-command.js';
import { answer } from './get-answer.js';

const options: Options = {
  ...commandOptions,
  ...answer
} as Options;

const { main } = await import(`./scripts/${command}.js`);

const taskOptions: Partial<TaskOptions> = {
  ...options
};

taskOptions.path = resolve(
  process.cwd(),
  options.name ? `packages/${options.name}` : ''
);

if (options.newName)
  taskOptions.newPath = resolve(process.cwd(), `packages/${options.newName}`);

await main(taskOptions);
