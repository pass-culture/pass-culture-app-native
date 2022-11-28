import React from 'react'

import { useAuthContext } from 'features/auth/AuthContext'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, waitFor } from 'tests/utils'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

jest.mock('features/auth/settings')

describe('<BookingPropertiesSection />', () => {
  beforeAll(() => {
    const { user: globalMockUser } = mockUseAuthContext()
    mockUseAuthContext.mockReturnValue({
      user: {
        ...globalMockUser,
        firstName: 'Christophe',
        lastName: 'Dupont',
      },
    })
  })
  const booking = bookingsSnap.ongoing_bookings[0]

  it('should display user firstname and lastname', async () => {
    const { getByText } = renderBookingProperties(booking)

    await waitFor(() => {
      expect(getByText('Christophe\u00a0Dupont')).toBeTruthy()
    })
  })

  it('should display duo icon when offer is duo', async () => {
    booking.quantity = 2
    const { getByTestId } = renderBookingProperties(booking)

    await waitFor(() => {
      expect(getByTestId('duo-icon')).toBeTruthy()
    })
  })

  it('should display date label', async () => {
    const { getByText } = renderBookingProperties(booking)

    await waitFor(() => {
      expect(getByText('Le 15 mars 2021 à 20h00')).toBeTruthy()
    })
  })

  it('should display location label if offer is not permanent and not a digital event', async () => {
    booking.stock.offer.isDigital = false
    booking.stock.offer.isPermanent = false
    const { getByText } = renderBookingProperties(booking)
    await waitFor(() => {
      expect(getByText('Maison de la Brique, Drancy')).toBeTruthy()
    })
  })
})

function renderBookingProperties(booking: Booking) {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  const wrapper = render(reactQueryProviderHOC(<BookingPropertiesSection booking={booking} />))
  return wrapper
}
