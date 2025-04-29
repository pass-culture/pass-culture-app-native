import { offerResponseSnap as baseOffer } from 'features/offer/fixtures/offerResponse'

import { getIsFreeOffer } from './getIsFreeOffer'

describe('getIsFreeOffer', () => {
  it('returns true if the first stock price is 0', () => {
    const offer = {
      ...baseOffer,
      stocks: [{ ...baseOffer.stocks[0], price: 0 }],
    }

    expect(getIsFreeOffer(offer)).toBe(true)
  })

  it('returns false if the first stock price is greater than 0', () => {
    const offer = {
      ...baseOffer,
      stocks: [{ ...baseOffer.stocks[0], price: 100 }],
    }

    expect(getIsFreeOffer(offer)).toBe(false)
  })

  it('returns false if there are no stocks', () => {
    const offer = {
      ...baseOffer,
      stocks: [],
    }

    expect(getIsFreeOffer(offer)).toBe(false)
  })
})
