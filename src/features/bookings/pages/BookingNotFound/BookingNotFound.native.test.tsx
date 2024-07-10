import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, screen } from 'tests/utils'

import { BookingNotFound } from './BookingNotFound'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('<BookingNotFound/>', () => {
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
    it('should navigate to bookings when clicking on cta', () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
      render(<BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />)
      fireEvent.press(screen.getByText('Mes réservations terminées'))

      expect(navigate).toHaveBeenCalledWith('Bookings', undefined)
    })
  })
})
