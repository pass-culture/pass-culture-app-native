import React from 'react'

import { OnboardingGeolocation } from 'features/onboarding/pages/onboarding/OnboardingGeolocation'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockRequestGeolocPermission = jest.fn()
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({ requestGeolocPermission: mockRequestGeolocPermission }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('OnboardingGeolocation', () => {
  it('should render correctly', () => {
    render(<OnboardingGeolocation />)

    expect(screen).toMatchSnapshot()
  })

  it('should request geoloc permission when "Continuer" is clicked', async () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Continuer')
    await user.press(loginButton)

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when "Continuer" is clicked', async () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Continuer')
    await user.press(loginButton)

    expect(analytics.logOnboardingGeolocationClicked).toHaveBeenNthCalledWith(1, {
      type: 'use_my_position',
    })
  })
})
