import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { getBookingLabelForActivationCode } from 'features/bookings/helpers'
import { Booking } from 'features/bookings/types'

describe('getBookingLabelForActivationCode', () => {
  it('should display the date in the label', () => {
    const booking = {
      ...bookingsSnapV2.ongoingBookings[0],
      ticket: {
        ...bookingsSnapV2.ongoingBookings[0].ticket,
        activationCode: { code: 'Code', expirationDate: '2021-03-15T23:01:37.925926' },
      },
    } as unknown as Booking

    const label = getBookingLabelForActivationCode(booking)

    expect(label).toEqual('À activer avant le 15 mars 2021')
  })

  it.each([{ activationCode: { expirationDate: '' } }, { activationCode: {} }, {}])(
    'should only display "A activer"',
    (activationCodeField) => {
      const booking = {
        ...bookingsSnapV2.ongoingBookings[0],
        ticket: {
          ...bookingsSnapV2.ongoingBookings[0].ticket,
          activationCode: activationCodeField,
        },
      } as unknown as Booking
      const label = getBookingLabelForActivationCode(booking)

      expect(label).toEqual('À activer')
    }
  )
})
