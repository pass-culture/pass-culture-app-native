import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { fireEvent, render, screen } from 'tests/utils'

import { BookingNotFound } from './BookingNotFound'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<BookingNotFound/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    render(<BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to ended bookings when clicking on cta', () => {
    render(<BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />)
    fireEvent.press(screen.getByText('Mes réservations terminées'))

    expect(navigate).toHaveBeenCalledWith('EndedBookings', undefined)
  })

  describe('when booking improve feature flag is activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE])
    })

    it('should navigate to bookings when clicking on cta', () => {
      render(<BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />)
      fireEvent.press(screen.getByText('Mes réservations terminées'))

      expect(navigate).toHaveBeenCalledWith('Bookings', undefined)
    })
  })
})
