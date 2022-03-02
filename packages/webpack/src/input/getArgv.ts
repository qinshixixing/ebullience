import yargs from 'yargs';
import { allTaskType } from '../taskType';

yargs.demandCommand(1);
yargs.command('dev', 'This command runs project in development mode.');
yargs.command('build', 'This command runs project in production mode.');
yargs.options({
  config: {
    alias: 'c',
    type: 'string'
  }
});
const argv = yargs.argv as {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
};

const taskType = String(argv._[0]);

if (!allTaskType.includes(taskType)) {
  console.error('The command is wrong!');
  yargs.showHelp();
  process.exit();
}

let configPath: string | undefined;
if (typeof argv.config === 'string') configPath = argv.config;

export { taskType, configPath };
