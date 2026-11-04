import {
  getScreeningsAfterNbDays,
  getScreeningsOnDay,
  hasScreeningWithinNextNbDays,
  shouldKeepOfferWithoutScreeningsOnDay,
} from './specialEventMovieOfferStocks'

describe('specialEventMovieOfferStocks', () => {
  const referenceDate = new Date('2026-11-01T10:00:00Z')

  it('keeps only future screenings when the selected date is today', () => {
    const futureScreening = { beginningDatetime: '2026-11-01T12:00:00Z' }
    const stocks = [futureScreening, { beginningDatetime: '2026-11-01T08:00:00Z' }]

    expect(getScreeningsOnDay(stocks, referenceDate, referenceDate)).toEqual([futureScreening])
  })

  it('separates screenings within and after the requested period', () => {
    const stockWithinPeriod = { beginningDatetime: '2026-11-10T10:00:00Z' }
    const stockAfterPeriod = { beginningDatetime: '2026-11-20T10:00:00Z' }
    const stocks = [stockWithinPeriod, stockAfterPeriod]

    expect(getScreeningsAfterNbDays(stocks, referenceDate, 15)).toEqual([stockAfterPeriod])
    expect(hasScreeningWithinNextNbDays(stocks, referenceDate, 15)).toBe(true)
  })

  it('removes an offer having a later screening on the selected day', () => {
    const stocks = [{ beginningDatetime: '2026-11-01T12:00:00Z' }]

    expect(shouldKeepOfferWithoutScreeningsOnDay(stocks, referenceDate)).toBe(false)
  })
})
