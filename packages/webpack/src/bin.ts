#!/usr/bin/env node
import { TaskType } from './taskType';
import { taskType, configPath } from './input/getArgv';
import task from './index';

task(<TaskType>taskType, configPath).then();
