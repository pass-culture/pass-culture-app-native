import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

import { BookingNotFound } from './BookingNotFound'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('<BookingNotFound/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    render(<BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />)

    expect(screen).toMatchSnapshot()
  })

  it('should display remote illustration when new vision UI FF is activated', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])

    render(<BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />)

    expect(screen.getByTestId('generic-info-page-remote-illustration')).toBeOnTheScreen()
  })

  it('should navigate to bookings when clicking on cta', async () => {
    render(<BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />)
    await user.press(screen.getByText('Mes réservations terminées'))

    expect(navigate).toHaveBeenCalledWith('Bookings', undefined)
  })
})
