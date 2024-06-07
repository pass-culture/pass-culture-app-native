export function splitArrayIntoStrings(array: string[], maxItemsPerString: number): string[] {
  const result: string[] = []

  for (let i = 0; i < array.length; i += maxItemsPerString) {
    result.push(array.slice(i, i + maxItemsPerString).join(','))
  }

  return result
}
