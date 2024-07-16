import mockdate from 'mockdate'

import { OfferResponseV2, OfferStockResponse } from 'api/gen'
import { MoviesOffer } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import {
  dateBuilder,
  offerResponseBuilder,
  stockBuilder,
} from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'

import { filterOffersStocks } from './filterOffersStocksByDate'

const DATE_WITH_STOCK = dateBuilder().withDay(8).toString()
const DATE_WITH_NO_STOCK = dateBuilder().withDay(5).toString()
const AVAILABLE_STOCK_ID = 11

const STOCKS = [
  stockBuilder().withId(AVAILABLE_STOCK_ID).withBeginningDatetime(DATE_WITH_STOCK).build(),
]

const offers: OfferResponseV2[] = [offerResponseBuilder().withId(1).withStocks(STOCKS).build()]

describe('filterOffersStocks', () => {
  it('should return all movies with a stock available at a specific date', () => {
    const filteredOffersStocks = filterOffersStocks(offers, new Date(DATE_WITH_STOCK))
    const expectedStock = getStockById(filteredOffersStocks, AVAILABLE_STOCK_ID)

    expect(expectedStock).toBeDefined()
  })

  it('should not return movies if a stock is unavailable at a specific date', () => {
    const filteredOffersStocks = filterOffersStocks(offers, new Date(DATE_WITH_NO_STOCK))

    const expectedStock = getStockById(filteredOffersStocks, AVAILABLE_STOCK_ID)

    expect(expectedStock).not.toBeDefined()
  })

  it('should filter the stocks by descending last30DaysBookings order', () => {
    const offers: OfferResponseV2[] = [
      offerResponseBuilder().withId(1).withLast30DaysBookings(100).withStocks(STOCKS).build(),
      offerResponseBuilder().withId(3).withLast30DaysBookings(300).withStocks(STOCKS).build(),
      offerResponseBuilder().withId(2).withLast30DaysBookings(200).withStocks(STOCKS).build(),
      offerResponseBuilder().withId(4).withLast30DaysBookings(400).withStocks(STOCKS).build(),
    ]

    const filteredOffersStocks = filterOffersStocks(offers, new Date(DATE_WITH_STOCK))

    expect(filteredOffersStocks[0]?.offer?.last30DaysBookings).toBe(400)
    expect(filteredOffersStocks[1]?.offer?.last30DaysBookings).toBe(300)
    expect(filteredOffersStocks[2]?.offer.last30DaysBookings).toBe(200)
    expect(filteredOffersStocks[3]?.offer.last30DaysBookings).toBe(100)
  })
})

it('should not return movies when there is no more screening until the end of the day', () => {
  const NOW = dateBuilder().withHours(16).toDate()
  mockdate.set(NOW)

  const BEFORE_NOW = dateBuilder().withHours(14).toString()
  const AFTER_NOW = dateBuilder().withHours(18).toString()

  const STOCK_BEFORE_NOW = stockBuilder().withBeginningDatetime(BEFORE_NOW).build()
  const STOCK_AFTER_NOW = stockBuilder().withBeginningDatetime(AFTER_NOW).build()

  const offersContainingAnOfferAfterNow = filterOffersStocks(
    [offerResponseBuilder().withStocks([STOCK_BEFORE_NOW, STOCK_AFTER_NOW]).build()],
    NOW
  )

  expect(offersContainingAnOfferAfterNow).toHaveLength(1)

  const offersContainingNoOfferAfterNow = filterOffersStocks(
    [offerResponseBuilder().withStocks([STOCK_BEFORE_NOW]).build()],
    NOW
  )

  expect(offersContainingNoOfferAfterNow).toHaveLength(0)
})

const getStockById = (moviesOffer: MoviesOffer[], id: number) => {
  return moviesOffer.find(({ offer }) =>
    offer?.stocks.find((stock: OfferStockResponse) => stock.id === id)
  )
}
