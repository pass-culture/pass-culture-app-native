import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { TutorialTypes } from 'features/tutorial/enums'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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

  it('should redirect to AgeSelectionFork when "Passer" is clicked when feature flag passForAll is enable', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL])
    render(<OnboardingGeolocation />)

    const button = screen.getByLabelText('Passer à la page suivante')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('ActivationStackNavigator', {
      screen: 'AgeSelectionFork',
      params: {
        type: TutorialTypes.ONBOARDING,
      },
    })
  })

  it('should request geoloc permission when "Utiliser ma position" is clicked', async () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Utiliser ma position')
    await user.press(loginButton)

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when "Utiliser ma position" is clicked', async () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Utiliser ma position')
    await user.press(loginButton)

    expect(analytics.logOnboardingGeolocationClicked).toHaveBeenNthCalledWith(1, {
      type: 'use_my_position',
    })
  })

  it('should log analytics when skip button is clicked', async () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Passer à la page suivante')
    await user.press(loginButton)

    expect(analytics.logOnboardingGeolocationClicked).toHaveBeenNthCalledWith(1, {
      type: 'skipped',
    })
  })
})
