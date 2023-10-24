import { getBookingOfferId } from 'features/offer/helpers/getBookingOfferId/getBookingOfferId'

describe('getBookingOfferId', () => {
  const bookedOffer = { 1090: 32927191, 2663: 32927185 }

  it('should return undefined when offer is not booked', () => {
    const bookingOfferId = getBookingOfferId(1500, bookedOffer)

    expect(bookingOfferId).toEqual(undefined)
  })

  it('should return undefined when booked offer is an empty object', () => {
    const bookingOfferId = getBookingOfferId(1500)

    expect(bookingOfferId).toEqual(undefined)
  })

  it('should return booking id when offer is booked', () => {
    const bookingOfferId = getBookingOfferId(1090, bookedOffer)

    expect(bookingOfferId).toEqual(32927191)
  })
})
