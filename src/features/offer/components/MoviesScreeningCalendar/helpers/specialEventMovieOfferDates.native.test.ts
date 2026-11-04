import { getEarliestScreeningTimestamp, getNextScreeningDate } from './specialEventMovieOfferDates'

describe('specialEventMovieOfferDates', () => {
  const referenceDate = new Date('2026-11-01T10:00:00Z')

  it('returns the closest screening after the selected date', () => {
    const closestDate = new Date('2026-11-03T10:00:00Z')
    const stocks = [
      { beginningDatetime: '2026-11-05T10:00:00Z' },
      { beginningDatetime: closestDate.toISOString() },
      { beginningDatetime: '2026-10-31T10:00:00Z' },
    ]

    expect(getNextScreeningDate(stocks, referenceDate, referenceDate)).toEqual(closestDate)
  })

  it('ignores a next screening occurring after 15 days', () => {
    const stocks = [{ beginningDatetime: '2026-11-20T10:00:00Z' }]

    expect(getNextScreeningDate(stocks, referenceDate, referenceDate)).toBeUndefined()
  })

  it('returns the earliest screening timestamp', () => {
    expect(
      getEarliestScreeningTimestamp([
        { beginningDatetime: '2026-11-05T10:00:00Z' },
        { beginningDatetime: undefined },
        { beginningDatetime: '2026-11-03T10:00:00Z' },
      ])
    ).toBe(new Date('2026-11-03T10:00:00Z').getTime())
  })
})
