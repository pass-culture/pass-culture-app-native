import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { fireEvent, render, screen } from 'tests/utils/web'

import { OnGoingBookingItem } from './OnGoingBookingItem'

jest.mock('libs/subcategories/useSubcategory')
jest.mock('libs/subcategories/useCategoryId')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('OnGoingBookingItem', () => {
  const booking: Booking = bookingsSnap.ongoing_bookings[0]

  it('should navigate to the booking details page', () => {
    render(<OnGoingBookingItem booking={booking} />)

    const item = screen.getByTestId(/Réservation de l’offre/)
    fireEvent.click(item)

    expect(navigate).toHaveBeenCalledWith('BookingDetails', { id: 123 })
  })
})
