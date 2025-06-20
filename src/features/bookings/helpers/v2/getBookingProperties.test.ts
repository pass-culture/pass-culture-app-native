import { BookingResponse } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { getBookingPropertiesV2 } from 'features/bookings/helpers'

describe('getBookingProperties', () => {
  it('when an event booking is provided', () => {
    const booking = bookingsSnapV2.endedBookings[0]
    const bookingMock: BookingResponse = {
      ...booking,
      stock: {
        ...booking.stock,
        offer: {
          ...booking.stock.offer,
          isDigital: true,
          isPermanent: true,
        },
      },
      ticket: {
        ...booking.ticket,
        activationCode: null,
      },
    }

    const isEvent = true

    const bookingProperties = getBookingPropertiesV2.getBookingProperties(bookingMock, isEvent)

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
    const booking = bookingsSnapV2.endedBookings[0]
    const bookingMock: BookingResponse = {
      ...booking,
      stock: {
        ...booking.stock,
        offer: {
          ...booking.stock.offer,
          isDigital: true,
          isPermanent: true,
        },
      },
      ticket: {
        ...booking.ticket,
        activationCode: null,
      },
    }
    const isEvent = false

    const bookingProperties = getBookingPropertiesV2.getBookingProperties(bookingMock, isEvent)

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
    const booking = bookingsSnapV2.endedBookings[0]
    const bookingMock: BookingResponse = {
      ...booking,
      stock: {
        ...booking.stock,
        offer: {
          ...booking.stock.offer,
          isDigital: true,
          isPermanent: true,
        },
      },
      ticket: {
        ...booking.ticket,
        activationCode: { code: 'toto' },
      },
    }

    const isEvent = false

    const bookingProperties = getBookingPropertiesV2.getBookingProperties(bookingMock, isEvent)

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
      const booking = bookingsSnapV2.endedBookings[0]
      const bookingMock: BookingResponse = {
        ...booking,
        stock: {
          ...booking.stock,
          offer: {
            ...booking.stock.offer,
            isDigital: true,
            isPermanent: true,
          },
        },
        quantity: 2,
      }

      const isEvent = true

      const bookingProperties = getBookingPropertiesV2.getBookingProperties(bookingMock, isEvent)

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
      const booking = bookingsSnapV2.endedBookings[0]
      const bookingMock: BookingResponse = {
        ...booking,
        stock: {
          ...booking.stock,
          offer: {
            ...booking.stock.offer,
            isDigital: true,
            isPermanent: true,
          },
        },
        quantity: 2,
      }

      const isEvent = false

      const bookingProperties = getBookingPropertiesV2.getBookingProperties(bookingMock, isEvent)

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
