import { navigateFromRef } from 'features/navigation/navigationRef'

import { navigateToBooking } from './navigateToBooking'

jest.mock('features/navigation/navigationRef')

describe('[Method] navigateToBooking', () => {
  it('should navigate to BookingDetails', async () => {
    const bookingId = 37815152
    navigateToBooking(bookingId)
    expect(navigateFromRef).toBeCalledWith('BookingDetails', { id: bookingId })
  })
})
