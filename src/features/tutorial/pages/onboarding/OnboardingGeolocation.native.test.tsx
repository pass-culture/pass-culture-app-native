import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { TutorialTypes } from 'features/tutorial/enums'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

const mockRequestGeolocPermission = jest.fn()
jest.mock('libs/geolocation/LocationWrapper', () => ({
  useLocation: () => ({ requestGeolocPermission: mockRequestGeolocPermission }),
}))

describe('OnboardingGeolocation', () => {
  it('should render correctly', () => {
    render(<OnboardingGeolocation />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to AgeSelection when "Passer" is clicked', async () => {
    render(<OnboardingGeolocation />)

    const button = screen.getByLabelText('Aller à l’écran suivant')
    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('AgeSelection', {
      type: TutorialTypes.ONBOARDING,
    })
  })

  it('should request geoloc permission when "Utiliser ma position" is clicked', async () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Utiliser ma position')
    fireEvent.press(loginButton)

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when "Utiliser ma position" is clicked', async () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Utiliser ma position')
    fireEvent.press(loginButton)

    expect(analytics.logOnboardingGeolocationClicked).toHaveBeenNthCalledWith(1, {
      type: 'use_my_position',
    })
  })

  it('should log analytics when skip button is clicked', async () => {
    render(<OnboardingGeolocation />)

    const loginButton = screen.getByLabelText('Aller à l’écran suivant')
    fireEvent.press(loginButton)

    expect(analytics.logOnboardingGeolocationClicked).toHaveBeenNthCalledWith(1, {
      type: 'skipped',
    })
  })
})
