import { getDateString, getMovieScreenings } from './getMovieScreenings'

describe('getMovieScreenings', () => {
  const screeningDate = '2026-11-02T12:00:00Z'

  it('groups available stocks by day', () => {
    const stock = {
      beginningDatetime: screeningDate,
      isExpired: false,
      isForbiddenToUnderage: false,
    }

    expect(getMovieScreenings([stock])).toEqual({
      [getDateString(screeningDate)]: [stock],
    })
  })

  it.each([
    { beginningDatetime: undefined, isExpired: false, isForbiddenToUnderage: false },
    { beginningDatetime: screeningDate, isExpired: true, isForbiddenToUnderage: false },
    { beginningDatetime: screeningDate, isExpired: false, isForbiddenToUnderage: true },
  ])('ignores unavailable stocks', (stock) => {
    expect(getMovieScreenings([stock])).toEqual({})
  })
})
