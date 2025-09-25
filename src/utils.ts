export function getRandomItem<T>(arr: T[]): T {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('Cannot pick a random item from an empty array');
  }
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}
