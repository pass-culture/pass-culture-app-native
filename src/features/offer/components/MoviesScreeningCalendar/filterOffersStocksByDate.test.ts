import { OfferStockResponse } from 'api/gen'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'

import { filterOffersStocksByDate } from './filterOffersStocksByDate'

describe('filterOffersStocksByDate', () => {
  it('should return all movies with a stock available at a specific date', () => {
    const filteredOffersStocks = filterOffersStocksByDate(
      offersStocksResponseSnap,
      new Date('2024-05-08T12:50:00Z')
    )

    const expectedStock = filteredOffersStocks.offers[0]?.stocks.find(
      (stock: OfferStockResponse) => stock.id === 10559
    )

    expect(expectedStock).toBeDefined()
  })

  it('should not return movies if a stock is unavailable at a specific date', () => {
    const filteredOffersStocks = filterOffersStocksByDate(
      offersStocksResponseSnap,
      new Date('2024-05-10T12:50:00Z')
    )

    const expectedStock = filteredOffersStocks.offers[0]?.stocks.find(
      (stock: OfferStockResponse) => stock.id === 10559
    )

    expect(expectedStock).not.toBeDefined()
  })
})
