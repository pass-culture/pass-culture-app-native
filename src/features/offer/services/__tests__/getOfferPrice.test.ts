import { OfferStockResponse } from 'api/gen'

import { getOfferPrice } from '../getOfferPrice'
import { notExpiredStock as baseStock } from '../useCtaWordingAndAction.testsFixtures'

describe('getOfferPrice', () => {
  it('should consider bookable stock first', () => {
    const stocks: OfferStockResponse[] = [
      { ...baseStock, price: 4, isBookable: false },
      { ...baseStock, price: 5 }, // selected
      { ...baseStock, price: 6 },
    ]
    expect(getOfferPrice(stocks)).toBe(5)
  })
  it('should consider all stock if no bookable', () => {
    const stocks: OfferStockResponse[] = [
      { ...baseStock, price: 4, isBookable: false }, // selected
      { ...baseStock, price: 5, isBookable: false },
    ]
    expect(getOfferPrice(stocks)).toBe(4)
  })
})
