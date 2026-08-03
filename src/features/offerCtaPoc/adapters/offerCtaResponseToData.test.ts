import {
  OfferCtaApiResponse,
  offerCtaResponseToData,
} from 'features/offerCtaPoc/adapters/offerCtaResponseToData'

// Pure adapter test: 0 mock, 0 React. Same kill-criterion as the core.

describe('offerCtaResponseToData', () => {
  const response: OfferCtaApiResponse = {
    offer: { id: 1, title: 'Concert', price: 1500, soldOut: false },
    viewer: { authenticated: true, hasEnoughCredit: true, existingBookingOfferId: null },
  }

  it('maps the API DTO to the domain shape', () => {
    expect(offerCtaResponseToData(response)).toEqual({
      offer: { id: 1, name: 'Concert', priceInCents: 1500, isSoldOut: false },
      user: { isLoggedIn: true, hasEnoughCredit: true, alreadyBookedOfferId: undefined },
    })
  })

  it('turns a null booking id into undefined', () => {
    const withBooking = {
      ...response,
      viewer: { ...response.viewer, existingBookingOfferId: 42 },
    }

    expect(offerCtaResponseToData(withBooking).user.alreadyBookedOfferId).toBe(42)
  })
})
