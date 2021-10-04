export function isArraysSameLength(...arrays: Array<any>): boolean {
  return arrays.every(
    (element, index, array) => element.length === array[0].length
  );
}
