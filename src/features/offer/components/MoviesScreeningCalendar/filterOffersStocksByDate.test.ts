import { OfferStockResponse } from 'api/gen'
import { offersStocksFixtures } from 'features/offer/components/MoviesScreeningCalendar/fixtures/offersStocks.fixtures'

import { filterOffersStocksByDate } from './filterOffersStocksByDate'

describe('filterOffersStocksByDate', () => {
  it('should return all movies with a stock available at a specific date', () => {
    const filteredOffersStocks = filterOffersStocksByDate(
      offersStocksFixtures,
      new Date('2024-05-26T15:45:00Z')
    )

    const expectedStock = filteredOffersStocks.offers[0]?.stocks.find(
      (stock: OfferStockResponse) => stock.id === 238133740
    )

    expect(expectedStock).toBeDefined()
  })

  it('should not return movies if a stock is unavailable at a specific date', () => {
    const filteredOffersStocks = filterOffersStocksByDate(
      offersStocksFixtures,
      new Date('2024-05-28T15:45:00Z')
    )

    const expectedStock = filteredOffersStocks.offers[0]?.stocks.find(
      (stock: OfferStockResponse) => stock.id === 238133740
    )

    expect(expectedStock).not.toBeDefined()
  })

  it('should return movie when the date is the same as the movie', () => {
    const filteredOffersStocks = filterOffersStocksByDate(
      offersStocksFixtures,
      new Date('2024-05-26T16:45:00Z')
    )

    const expectedStock = filteredOffersStocks.offers[0]?.stocks.find(
      (stock: OfferStockResponse) => stock.id === 238133740
    )

    expect(expectedStock).toBeDefined()
  })
})
