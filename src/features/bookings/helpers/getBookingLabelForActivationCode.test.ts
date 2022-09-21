import { Booking } from 'features/bookings/components/types'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { getBookingLabelForActivationCode } from 'features/bookings/helpers'

describe('getBookingLabelForActivationCode', () => {
  it('should display the date in the label', () => {
    const booking = {
      ...bookingsSnap.ongoing_bookings[0],
      activationCode: { expirationDate: '2021-03-15T23:01:37.925926' },
    } as unknown as Booking

    const label = getBookingLabelForActivationCode(booking)
    expect(label).toEqual('À activer avant le 15 mars 2021')
  })

  it.each([{ activationCode: { expirationDate: '' } }, { activationCode: {} }, {}])(
    'should only display "A activer"',
    (activationCodeField) => {
      const booking = {
        ...bookingsSnap.ongoing_bookings[0],
        ...activationCodeField,
      } as unknown as Booking
      const label = getBookingLabelForActivationCode(booking)

      expect(label).toEqual('À activer')
    }
  )
})
