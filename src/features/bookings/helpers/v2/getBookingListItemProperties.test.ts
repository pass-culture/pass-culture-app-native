import { endedBookingsV2ListSnap } from 'features/bookings/fixtures/bookingsSnap'
import { getBookingListItemProperties } from 'features/bookings/helpers'

describe('getBookingListItemProperties', () => {
  const mockBooking = endedBookingsV2ListSnap.bookings[0]

  it('when an event booking is provided', () => {
    const booking = {
      ...mockBooking,
      stock: {
        ...mockBooking.stock,
        offer: {
          ...mockBooking.stock.offer,
          isDigital: true,
          isPermanent: true,
        },
      },
      activationCode: null,
    }

    const isEvent = true

    const bookingProperties = getBookingListItemProperties(booking, isEvent)

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
      ...mockBooking,
      stock: {
        ...mockBooking.stock,
        offer: {
          ...mockBooking.stock.offer,
          isDigital: true,
          isPermanent: true,
        },
      },
      activationCode: null,
    }

    const isEvent = false

    const bookingProperties = getBookingListItemProperties(booking, isEvent)

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
      ...mockBooking,
      stock: {
        ...mockBooking.stock,
        offer: {
          ...mockBooking.stock.offer,
          isDigital: true,
          isPermanent: true,
        },
      },
      activationCode: { code: 'toto' },
    }

    const isEvent = false

    const bookingProperties = getBookingListItemProperties(booking, isEvent)

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
        ...mockBooking,
        stock: {
          ...mockBooking.stock,
          offer: {
            ...mockBooking.stock.offer,
            isDigital: true,
            isPermanent: true,
          },
        },
        quantity: 2,
        activationCode: null,
      }

      const isEvent = true

      const bookingProperties = getBookingListItemProperties(booking, isEvent)

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
        ...mockBooking,
        stock: {
          ...mockBooking.stock,
          offer: {
            ...mockBooking.stock.offer,
            isDigital: true,
            isPermanent: true,
          },
        },
        quantity: 2,
        activationCode: null,
      }

      const isEvent = false

      const bookingProperties = getBookingListItemProperties(booking, isEvent)

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
