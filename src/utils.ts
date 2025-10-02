import { exists, readFile, writeFile } from 'react-native-fs';

export function getRandomItem<T>(arr: T[]): T {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('Cannot pick a random item from an empty array');
  }
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

async function readJsonFile<T>(filepath: string): Promise<T | undefined> {
  try {
    const jsonString = await readFile(filepath, 'utf8');
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error reading file:', error);
    return undefined;
  }
}

export async function getDataFile<T>(path: string, standardData: T) {
  const exist = await exists(path);

  if (!exist) {
    await writeFile(path, JSON.stringify(standardData), 'utf8');
  }
  return await readJsonFile<T>(path);
}
