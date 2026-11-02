import { OfferResponse } from 'api/gen'

import { selectBookingSelectedStock } from './selectBookingSelectedStock'

const offer = {
  stocks: [
    { id: 2, price: 1000 },
    { id: 3, price: 500 },
  ],
} as OfferResponse

describe('selectBookingSelectedStock', () => {
  it('should return the stock matching the stock id', () => {
    expect(selectBookingSelectedStock(2)(offer)).toEqual(offer.stocks[0])
  })

  it('should return undefined when the stock id is missing', () => {
    expect(selectBookingSelectedStock()(offer)).toBeUndefined()
  })

  it('should return undefined when no stock matches', () => {
    expect(selectBookingSelectedStock(99)(offer)).toBeUndefined()
  })
})
