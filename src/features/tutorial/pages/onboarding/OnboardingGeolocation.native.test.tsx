import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { TutorialTypes } from 'features/tutorial/enums'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { analytics } from 'libs/analytics'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { fireEvent, render, screen } from 'tests/utils'

const mockRequestGeolocPermission = jest.fn()
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({ requestGeolocPermission: mockRequestGeolocPermission }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('OnboardingGeolocation', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    render(<OnboardingGeolocation />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to EligibleUserAgeSelection when "Passer" is clicked', () => {
    render(<OnboardingGeolocation />)

    const button = screen.getByLabelText('Aller à l’écran suivant')
    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('EligibleUserAgeSelection', {
      type: TutorialTypes.ONBOARDING,
    })
  })

  it('should redirect to AgeSelectionFork when "Passer" is clicked when feature flag passForAll is enable', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL])
    render(<OnboardingGeolocation />)

    const button = screen.getByLabelText('Aller à l’écran suivant')
    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('AgeSelectionFork', {
      type: TutorialTypes.ONBOARDING,
    })
  })

  it('should request geoloc permission when "Utiliser ma position" is clicked', () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Utiliser ma position')
    fireEvent.press(loginButton)

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when "Utiliser ma position" is clicked', () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Utiliser ma position')
    fireEvent.press(loginButton)

    expect(analytics.logOnboardingGeolocationClicked).toHaveBeenNthCalledWith(1, {
      type: 'use_my_position',
    })
  })

  it('should log analytics when skip button is clicked', () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Aller à l’écran suivant')
    fireEvent.press(loginButton)

    expect(analytics.logOnboardingGeolocationClicked).toHaveBeenNthCalledWith(1, {
      type: 'skipped',
    })
  })
})
