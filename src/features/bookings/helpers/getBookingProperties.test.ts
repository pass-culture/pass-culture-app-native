import { Booking } from 'features/bookings/components/types'
import { getBookingProperties } from 'features/bookings/helpers'

describe('getBookingProperties', () => {
  it('when an event booking is provided', () => {
    const booking = {
      stock: { offer: { isDigital: true, isPermanent: true } },
      activationCode: null,
    } as Booking

    const isEvent = true

    const bookingProperties = getBookingProperties(booking, isEvent)

    expect(bookingProperties).toEqual({
      isDuo: false,
      isEvent: true,
      isPhysical: false,
      isDigital: true,
      isPermanent: true,
      hasActivationCode: false,
    })
  })

  it('when a physical booking is provided', () => {
    const booking = {
      stock: { offer: { isDigital: true, isPermanent: true } },
      activationCode: null,
    } as Booking

    const isEvent = false

    const bookingProperties = getBookingProperties(booking, isEvent)

    expect(bookingProperties).toEqual({
      isDuo: false,
      isEvent: false,
      isPhysical: true,
      isDigital: true,
      isPermanent: true,
      hasActivationCode: false,
    })
  })

  it('when a booking with activation code is provided', () => {
    const booking = {
      stock: { offer: { isDigital: true, isPermanent: true } },
      activationCode: { code: 'toto' },
    } as Booking

    const isEvent = false

    const bookingProperties = getBookingProperties(booking, isEvent)

    expect(bookingProperties).toEqual({
      isDuo: false,
      isEvent: false,
      isPhysical: true,
      isDigital: true,
      isPermanent: true,
      hasActivationCode: true,
    })
  })

  describe('when duo', () => {
    it('with an event', () => {
      const booking = {
        stock: { offer: { isDigital: true, isPermanent: true } },
        quantity: 2,
      } as Booking

      const isEvent = true

      const bookingProperties = getBookingProperties(booking, isEvent)

      expect(bookingProperties).toEqual({
        isDuo: true,
        isEvent: true,
        isPhysical: false,
        isDigital: true,
        isPermanent: true,
        hasActivationCode: false,
      })
    })

    it('with an non-event', () => {
      const booking = {
        stock: { offer: { isDigital: true, isPermanent: true } },
        quantity: 2,
      } as Booking

      const isEvent = false

      const bookingProperties = getBookingProperties(booking, isEvent)

      expect(bookingProperties).toEqual({
        isDuo: true,
        isEvent: false,
        isPhysical: true,
        isDigital: true,
        isPermanent: true,
        hasActivationCode: false,
      })
    })
  })
})
