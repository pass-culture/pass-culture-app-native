import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EndedBookingsSection } from 'features/bookings/components/EndedBookingsSection'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('<BookingNotFound/>', () => {
  it('should render correctly', () => {
    render(<EndedBookingsSection endedBookings={bookingsSnap.ended_bookings} />)

    expect(screen.getByText('Réservations terminées')).toBeOnTheScreen()
  })

  it('should not render when there is no ended bookings', () => {
    render(<EndedBookingsSection />)

    expect(screen.queryByText('Réservations terminées')).not.toBeOnTheScreen()
  })

  it('should navigate to ended bookings when clicking on cta', () => {
    render(<EndedBookingsSection endedBookings={bookingsSnap.ended_bookings} />)
    fireEvent.press(screen.getByText('Réservations terminées'))

    expect(navigate).toHaveBeenCalledWith('EndedBookings', undefined)
  })

  describe('when booking improve feature flag is activated', () => {
    it('should navigate to bookings when clicking on cta', () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
      render(<EndedBookingsSection endedBookings={bookingsSnap.ended_bookings} />)
      fireEvent.press(screen.getByText('Réservations terminées'))

      expect(navigate).toHaveBeenCalledWith('Bookings', undefined)
    })
  })
})
