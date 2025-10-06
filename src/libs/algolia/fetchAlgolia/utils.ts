export const buildHitsPerPage = (hitsPerPage: number | null) =>
  hitsPerPage ? { hitsPerPage } : null

export const parseAndCleanStringsToNumbers = (allocineIdList: string[]) =>
  allocineIdList
    .map(Number)
    .filter(
      (allocineId) =>
        !Number.isNaN(allocineId) &&
        allocineId !== 0 &&
        allocineId !== Infinity &&
        allocineId !== -Infinity
    )
