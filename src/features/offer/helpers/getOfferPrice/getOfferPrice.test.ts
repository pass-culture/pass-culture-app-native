import { OfferStockResponse } from 'api/gen'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'

import { getOfferPrice } from './getOfferPrice'

describe('getOfferPrice', () => {
  it('should consider bookable stock first', () => {
    const stocks: OfferStockResponse[] = [
      { ...offerStockResponseSnap, price: 400, isBookable: false },
      { ...offerStockResponseSnap, price: 500 }, // selected
      { ...offerStockResponseSnap, price: 600 },
    ]
    expect(getOfferPrice(stocks)).toBe(500)
  })
  it('should consider all stock if no bookable', () => {
    const stocks: OfferStockResponse[] = [
      { ...offerStockResponseSnap, price: 400, isBookable: false }, // selected
      { ...offerStockResponseSnap, price: 500, isBookable: false },
    ]
    expect(getOfferPrice(stocks)).toBe(400)
  })
})
