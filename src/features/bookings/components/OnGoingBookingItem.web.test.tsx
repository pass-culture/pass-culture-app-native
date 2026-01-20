import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingResponse } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { fireEvent, render, screen, waitFor } from 'tests/utils/web'

import { OnGoingBookingItem } from './OnGoingBookingItem'

jest.mock('libs/subcategories/useSubcategory')
jest.mock('libs/subcategories/useCategoryId')

jest.mock('libs/firebase/analytics/analytics')

describe('OnGoingBookingItem', () => {
  const booking: BookingResponse = bookingsSnapV2.ongoingBookings[0]

  it('should navigate to the booking details page', async () => {
    render(<OnGoingBookingItem booking={booking} eligibleBookingsForArchive={[]} />)

    const item = screen.getByTestId(/Réservation de l’offre/)
    fireEvent.click(item)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('BookingDetails', { id: 123 })
    })
  })
})
