import { getNextPageParam } from 'shared/getNextPageParam/getNextPageParam'

describe('getNextPageParam', () => {
  it('should return page + 1 when page + 1 < nbPages', () => {
    const nextPageParam = getNextPageParam({ page: 1, nbPages: 3 })
    expect(nextPageParam).toEqual(2)
  })

  it('should return undefined when page + 1 = nbPages', () => {
    const nextPageParam = getNextPageParam({ page: 1, nbPages: 2 })
    expect(nextPageParam).toEqual(undefined)
  })

  it('should return undefined when page + 1 > nbPages', () => {
    const nextPageParam = getNextPageParam({ page: 2, nbPages: 2 })
    expect(nextPageParam).toEqual(undefined)
  })
})
