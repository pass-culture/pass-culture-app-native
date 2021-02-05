import { OfferStockResponse } from 'api/gen'

import { getOfferPrice } from '../getOfferPrice'
import { notExpiredStock as baseStock } from '../useCtaWordingAndAction.testsFixtures'

describe('getOfferPrice', () => {
  it('should consider bookable stock first', () => {
    const stocks: OfferStockResponse[] = [
      { ...baseStock, price: 400, isBookable: false },
      { ...baseStock, price: 500 }, // selected
      { ...baseStock, price: 600 },
    ]
    expect(getOfferPrice(stocks)).toBe(500)
  })
  it('should consider all stock if no bookable', () => {
    const stocks: OfferStockResponse[] = [
      { ...baseStock, price: 400, isBookable: false }, // selected
      { ...baseStock, price: 500, isBookable: false },
    ]
    expect(getOfferPrice(stocks)).toBe(400)
  })
})
