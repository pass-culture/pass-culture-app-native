export const buildHitsPerPage = (hitsPerPage: number | null) =>
  hitsPerPage ? { hitsPerPage } : null

export function parseAndCleanStringsToNumbers(allocineIdList: string[]) {
  return allocineIdList
    .map(Number)
    .filter(
      (allocineId) =>
        !Number.isNaN(allocineId) &&
        allocineId !== 0 &&
        allocineId !== Infinity &&
        allocineId !== -Infinity
    )
}
