// Mock for algoliasearch and algoliasearch/lite

const searchForHits = jest.fn().mockResolvedValue({ results: [] })
const search = jest.fn().mockResolvedValue({ results: [] })

// New liteClient API (algoliasearch/lite)
export const liteClient = jest.fn(() => ({
  searchForHits,
  search,
}))

// Legacy API - keep for backward compatibility during migration
const getObjects = jest.fn()
const legacySearch = jest.fn()
const initIndex = jest.fn().mockReturnValue({ search: legacySearch, getObjects })
const multipleQueries = jest.fn()

export default jest.fn(() => ({
  initIndex,
  multipleQueries,
}))
