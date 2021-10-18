export const buildHitsPerPage = (hitsPerPage: number | null) =>
  hitsPerPage ? { hitsPerPage } : null
