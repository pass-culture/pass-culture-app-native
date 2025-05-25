import React from 'react'

import { OnboardingGeolocation } from 'features/onboarding/pages/onboarding/OnboardingGeolocation'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
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
  beforeEach(() => setFeatureFlags())

  it('should render correctly', () => {
    render(reactQueryProviderHOC(<OnboardingGeolocation />))

    expect(screen).toMatchSnapshot()
  })

  it('should request geoloc permission when "Continuer" is clicked', async () => {
    render(reactQueryProviderHOC(<OnboardingGeolocation />))

    const loginButton = screen.getByLabelText('Continuer vers l’étape suivante')
    await user.press(loginButton)

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })
})
