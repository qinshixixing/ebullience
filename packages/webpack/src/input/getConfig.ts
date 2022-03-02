import { resolve } from 'path';
import { Option } from '../config/option';

async function getConfig(path: string) {
  const totalPath = resolve(process.cwd(), path);
  let config: Partial<Option>;
  try {
    config = (await import(totalPath)).default;
  } catch (e) {
    config = {};
  }
  return config;
}

export default getConfig;
