import { OffersStocksResponseV2, OfferStockResponse } from 'api/gen'
import {
  offerResponseBuilder,
  stockBuilder,
} from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'

import { filterOffersStocks } from './filterOffersStocksByDate'

const DATE_WITH_STOCK = '2024-05-08T12:50:00Z'
const DATE_WITH_NO_STOCK = '2024-05-10T12:50:00Z'
const AVAILABLE_STOCK_ID = 11

const STOCKS = [
  stockBuilder.withId(AVAILABLE_STOCK_ID).withBeginningDatetime(DATE_WITH_STOCK).build(),
]

const offerStocksResponse: OffersStocksResponseV2 = {
  offers: [offerResponseBuilder.withId(1).withStocks(STOCKS).build()],
}

describe('filterOffersStocks', () => {
  it('should return all movies with a stock available at a specific date', () => {
    const filteredOffersStocks = filterOffersStocks(offerStocksResponse, new Date(DATE_WITH_STOCK))
    const expectedStock = getStockById(filteredOffersStocks, AVAILABLE_STOCK_ID)

    expect(expectedStock).toBeDefined()
  })

  it('should not return movies if a stock is unavailable at a specific date', () => {
    const filteredOffersStocks = filterOffersStocks(
      offerStocksResponse,
      new Date(DATE_WITH_NO_STOCK)
    )

    const expectedStock = getStockById(filteredOffersStocks, AVAILABLE_STOCK_ID)

    expect(expectedStock).not.toBeDefined()
  })

  it('should filter the stocks by descending last30DaysBookings order', () => {
    const offerStocksResponse: OffersStocksResponseV2 = {
      offers: [
        offerResponseBuilder.withId(1).withLast30DaysBookings(100).withStocks(STOCKS).build(),
        offerResponseBuilder.withId(3).withLast30DaysBookings(300).withStocks(STOCKS).build(),
        offerResponseBuilder.withId(2).withLast30DaysBookings(200).withStocks(STOCKS).build(),
        offerResponseBuilder.withId(4).withLast30DaysBookings(400).withStocks(STOCKS).build(),
      ],
    }

    const filteredOffersStocks = filterOffersStocks(offerStocksResponse, new Date(DATE_WITH_STOCK))

    expect(filteredOffersStocks.offers[0]?.last30DaysBookings).toBe(400)
    expect(filteredOffersStocks.offers[1]?.last30DaysBookings).toBe(300)
    expect(filteredOffersStocks.offers[2]?.last30DaysBookings).toBe(200)
    expect(filteredOffersStocks.offers[3]?.last30DaysBookings).toBe(100)
  })
})

const getStockById = (offerStockResponse: OffersStocksResponseV2, id: number) => {
  return offerStockResponse.offers[0]?.stocks.find((stock: OfferStockResponse) => stock.id === id)
}
