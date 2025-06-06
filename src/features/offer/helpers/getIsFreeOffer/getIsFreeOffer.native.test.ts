import { offerResponseSnap as baseOffer } from 'features/offer/fixtures/offerResponse'

import { getIsFreeOffer } from './getIsFreeOffer'

describe('getIsFreeOffer', () => {
  it('returns true if there is only free stocks', () => {
    const offer = {
      ...baseOffer,
      stocks: [
        { ...baseOffer.stocks[0], price: 0 },
        { ...baseOffer.stocks[0], price: 0 },
        { ...baseOffer.stocks[0], price: 0 },
        { ...baseOffer.stocks[0], price: 0 },
      ],
    }

    expect(getIsFreeOffer(offer)).toBe(true)
  })

  it('returns true if there is at least one free stock', () => {
    const offer = {
      ...baseOffer,
      stocks: [
        { ...baseOffer.stocks[0], price: 0 },
        { ...baseOffer.stocks[0], price: 0 },
        { ...baseOffer.stocks[0], price: 100 },
        { ...baseOffer.stocks[0], price: 0 },
      ],
    }

    expect(getIsFreeOffer(offer)).toBe(true)
  })

  it('returns false if there are no stocks', () => {
    const offer = {
      ...baseOffer,
      stocks: [],
    }

    expect(getIsFreeOffer(offer)).toBe(false)
  })
})
