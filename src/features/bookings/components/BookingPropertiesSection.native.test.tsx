import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock
const mockUseFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

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
      expect(getByText('Christophe\u00a0Dupont')).toBeOnTheScreen()
    })
  })

  it('should display duo icon when offer is duo', async () => {
    booking.quantity = 2
    const { getByTestId } = renderBookingProperties(booking)

    await waitFor(() => {
      expect(getByTestId('duo-icon')).toBeOnTheScreen()
    })
  })

  it('should display date label', async () => {
    const { getByText } = renderBookingProperties(booking)

    await waitFor(() => {
      expect(getByText('Le 15 mars 2021 à 20h00')).toBeOnTheScreen()
    })
  })

  it('should display location label if offer is not permanent and not a digital event', async () => {
    booking.stock.offer.isDigital = false
    booking.stock.offer.isPermanent = false
    const { getByText } = renderBookingProperties(booking)
    await waitFor(() => {
      expect(getByText('Maison de la Brique, Drancy')).toBeOnTheScreen()
    })
  })

  it('should display price line with price details when wipAttributesCinemaOffers feature flag activated', () => {
    mockUseFeatureFlag.mockReturnValueOnce(true)
    renderBookingProperties(booking)

    expect(screen.getByText('8\u00a0€')).toBeOnTheScreen()
    expect(screen.getByText('(4\u00a0€ x 2 places)')).toBeOnTheScreen()
    expect(screen.getByText('- VOSTFR 3D IMAX')).toBeOnTheScreen()
    expect(screen.getByTestId('price-line__price-detail')).toBeOnTheScreen()
    expect(screen.getByTestId('price-line__attributes')).toBeOnTheScreen()
  })

  it("should not show cinema's attributes when wipAttributesCinemaOffers feature flag deactivated", () => {
    mockUseFeatureFlag.mockReturnValueOnce(false)
    renderBookingProperties(booking)

    expect(screen.queryByText('- VOSTFR 3D IMAX')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('price-line__attributes')).not.toBeOnTheScreen()
  })
})

function renderBookingProperties(booking: Booking) {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<BookingPropertiesSection booking={booking} />))
}
