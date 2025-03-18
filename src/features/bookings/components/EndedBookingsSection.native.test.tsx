import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EndedBookingsSection } from 'features/bookings/components/EndedBookingsSection'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('<EndedBookingsSection/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    render(<EndedBookingsSection endedBookings={bookingsSnap.ended_bookings} />)

    expect(screen.getByText('Réservations terminées')).toBeOnTheScreen()
  })

  it('should not render when there is no ended bookings', () => {
    render(<EndedBookingsSection />)

    expect(screen.queryByText('Réservations terminées')).not.toBeOnTheScreen()
  })

  it('should navigate to bookings when clicking on cta', () => {
    render(<EndedBookingsSection endedBookings={bookingsSnap.ended_bookings} />)
    fireEvent.press(screen.getByText('Réservations terminées'))

    expect(navigate).toHaveBeenCalledWith('Bookings', undefined)
  })
})
