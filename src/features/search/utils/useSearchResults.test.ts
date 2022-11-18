import { getNextPageParam } from 'features/search/utils/useSearchResults'

describe('useSearchResults', () => {
  describe('getNextPageParam', () => {
    it('should return page + 1 when page + 1 < nbPages', () => {
      const page = getNextPageParam({ page: 0, nbPages: 2 })
      expect(page).toStrictEqual(1)
    })

    it('should return undefined when page + 1 >= nbPages', () => {
      const page = getNextPageParam({ page: 1, nbPages: 2 })
      expect(page).toStrictEqual(undefined)
    })
  })
})
