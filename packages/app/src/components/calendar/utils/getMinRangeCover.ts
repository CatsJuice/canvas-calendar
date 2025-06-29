export function getMinRangeCover<T>(
  arr: T[],
  a: T,
  b: T,
  compare: (x: T, y: T) => number
): T[] {
  const n = arr.length;
  if (n === 0) return [];

  function findMaxLE(x: T): number {
    let left = 0;
    let right = n - 1;
    let res = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (compare(arr[mid], x) <= 0) {
        res = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return res;
  }

  function findMinGE(x: T): number {
    let left = 0;
    let right = n - 1;
    let res = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (compare(arr[mid], x) >= 0) {
        res = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return res;
  }

  const leftIndex = findMaxLE(a);
  const rightIndex = findMinGE(b);

  if (leftIndex === -1 || rightIndex === -1 || leftIndex > rightIndex) {
    return [];
  }

  return arr.slice(leftIndex, rightIndex + 1);
}
