import mockdate from 'mockdate'

import { OfferResponseV2, OfferStockResponse } from 'api/gen'
import { MovieOffer } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { dateBuilder, mockBuilder } from 'tests/mockBuilder'

import { filterOffersStocksByDate } from './filterOffersStocksByDate'

const DATE_WITH_STOCK = dateBuilder().withDay(8).toString()
const DATE_WITH_NO_STOCK = dateBuilder().withDay(5).toString()
const AVAILABLE_STOCK_ID = 11

const STOCKS = [
  mockBuilder.offerStockResponse({
    id: AVAILABLE_STOCK_ID,
    beginningDatetime: DATE_WITH_STOCK,
  }),
]

const offers: OfferResponseV2[] = [
  mockBuilder.offerResponseV2({
    id: 1,
    stocks: STOCKS,
  }),
]

describe('filterOffersStocksByDate', () => {
  it('should return all movies with a stock available at a specific date', () => {
    const filteredOffersStocks = filterOffersStocksByDate(offers, new Date(DATE_WITH_STOCK))
    const expectedStock = getStockById(filteredOffersStocks, AVAILABLE_STOCK_ID)

    expect(expectedStock).toBeDefined()
  })

  it('should not return movies if a stock is unavailable at a specific date', () => {
    const filteredOffersStocksByDate = filterOffersStocksByDate(
      offers,
      new Date(DATE_WITH_NO_STOCK)
    )

    const expectedStock = getStockById(filteredOffersStocksByDate, AVAILABLE_STOCK_ID)

    expect(expectedStock).not.toBeDefined()
  })

  it('should sort the stocks by descending last30DaysBookings order', () => {
    const offers: OfferResponseV2[] = [
      mockBuilder.offerResponseV2({
        id: 1,
        last30DaysBookings: 100,
        stocks: STOCKS,
      }),
      mockBuilder.offerResponseV2({
        id: 3,
        last30DaysBookings: 300,
        stocks: STOCKS,
      }),
      mockBuilder.offerResponseV2({
        id: 2,
        last30DaysBookings: 200,
        stocks: STOCKS,
      }),
      mockBuilder.offerResponseV2({
        id: 4,
        last30DaysBookings: 400,
        stocks: STOCKS,
      }),
    ]

    const filteredOffersStocksByDate = filterOffersStocksByDate(offers, new Date(DATE_WITH_STOCK))

    expect(filteredOffersStocksByDate[0]?.offer?.last30DaysBookings).toBe(400)
    expect(filteredOffersStocksByDate[1]?.offer?.last30DaysBookings).toBe(300)
    expect(filteredOffersStocksByDate[2]?.offer.last30DaysBookings).toBe(200)
    expect(filteredOffersStocksByDate[3]?.offer.last30DaysBookings).toBe(100)
  })
})

it('should not return movies when there is no more screening until the end of the day', () => {
  const NOW = dateBuilder().withHours(16).toDate()
  mockdate.set(NOW)

  const BEFORE_NOW = dateBuilder().withHours(14).toString()
  const AFTER_NOW = dateBuilder().withHours(18).toString()

  const STOCK_BEFORE_NOW = mockBuilder.offerStockResponse({
    beginningDatetime: BEFORE_NOW,
  })
  const STOCK_AFTER_NOW = mockBuilder.offerStockResponse({
    beginningDatetime: AFTER_NOW,
  })

  const offersContainingAnOfferAfterNow = filterOffersStocksByDate(
    [mockBuilder.offerResponseV2({ stocks: [STOCK_BEFORE_NOW, STOCK_AFTER_NOW] })],
    NOW
  )

  expect(offersContainingAnOfferAfterNow).toHaveLength(1)

  const offersContainingNoOfferAfterNow = filterOffersStocksByDate(
    [mockBuilder.offerResponseV2({ stocks: [STOCK_BEFORE_NOW] })],
    NOW
  )

  expect(offersContainingNoOfferAfterNow).toHaveLength(0)
})

const getStockById = (movieOffer: MovieOffer[], id: number) => {
  return movieOffer.find(({ offer }) =>
    offer?.stocks.find((stock: OfferStockResponse) => stock.id === id)
  )
}
