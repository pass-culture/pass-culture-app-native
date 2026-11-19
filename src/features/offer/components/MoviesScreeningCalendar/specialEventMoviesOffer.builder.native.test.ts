import mockdate from 'mockdate'

import { OfferForStocksResponse, StockResponse } from 'api/gen'

import { specialEventMoviesOfferBuilder } from './specialEventMoviesOffer.builder'

const NOW = new Date('2026-11-01T10:00:00Z')
const SELECTED_DATE = new Date('2026-11-02T10:00:00Z')

mockdate.set(NOW)

describe('specialEventMoviesOfferBuilder', () => {
  afterAll(() => mockdate.reset())

  it('keeps screenings occurring on the selected day', () => {
    const selectedDayOffer = buildOffer(1, ['2026-11-02T12:00:00Z'])
    const anotherDayOffer = buildOffer(2, ['2026-11-03T12:00:00Z'])

    const offers = specialEventMoviesOfferBuilder([selectedDayOffer, anotherDayOffer])
      .withScreeningsOnDay(SELECTED_DATE)
      .buildOfferResponse()

    expect(offers).toEqual([selectedDayOffer])
  })

  it('sorts offers by descending bookings', () => {
    const lessBookedOffer = buildOffer(1, ['2026-11-02T12:00:00Z'], 5)
    const mostBookedOffer = buildOffer(2, ['2026-11-02T14:00:00Z'], 10)

    const offers = specialEventMoviesOfferBuilder([lessBookedOffer, mostBookedOffer])
      .sortedByLast30DaysBooking()
      .buildOfferResponse()

    expect(offers.map(({ id }) => id)).toEqual([2, 1])
  })

  it('keeps only offers with screenings after 15 days', () => {
    const offerWithinPeriod = buildOffer(1, ['2026-11-10T12:00:00Z'])
    const offerAfterPeriod = buildOffer(2, ['2026-11-20T12:00:00Z'])

    const offers = specialEventMoviesOfferBuilder([offerWithinPeriod, offerAfterPeriod])
      .withScreeningsAfterNbDays(15)
      .buildOfferResponse()

    expect(offers.map(({ id }) => id)).toEqual([2])
  })
})

const buildOffer = (
  id: number,
  screeningDates: string[],
  last30DaysBookings = 0
): OfferForStocksResponse =>
  ({
    id,
    last30DaysBookings,
    stocks: screeningDates.map(
      (beginningDatetime, stockIndex) => ({ id: stockIndex, beginningDatetime }) as StockResponse
    ),
    venue: { coordinates: { latitude: 48, longitude: 2 } },
  }) as OfferForStocksResponse
