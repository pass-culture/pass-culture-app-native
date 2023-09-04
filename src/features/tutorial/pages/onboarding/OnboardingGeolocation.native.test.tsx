import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

const mockRequestGeolocPermission = jest.fn()
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({ requestGeolocPermission: mockRequestGeolocPermission }),
}))

describe('OnboardingGeolocation', () => {
  it('should render correctly', () => {
    const renderAPI = render(<OnboardingGeolocation />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to AgeSelection when "Passer" is clicked', async () => {
    const { getByLabelText } = render(<OnboardingGeolocation />)

    const button = getByLabelText('Aller à l’écran suivant')
    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('AgeSelection', { type: 'onboarding' })
  })

  it('should request geoloc permission when "Utiliser ma position" is clicked', async () => {
    const { getByLabelText } = render(<OnboardingGeolocation />)

    const loginButton = getByLabelText('Utiliser ma position')
    fireEvent.press(loginButton)

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when "Utiliser ma position" is clicked', async () => {
    const { getByLabelText } = render(<OnboardingGeolocation />)

    const loginButton = getByLabelText('Utiliser ma position')
    fireEvent.press(loginButton)

    expect(analytics.logOnboardingGeolocationClicked).toHaveBeenNthCalledWith(1, {
      type: 'use_my_position',
    })
  })

  it('should log analytics when skip button is clicked', async () => {
    const { getByLabelText } = render(<OnboardingGeolocation />)

    const loginButton = getByLabelText('Aller à l’écran suivant')
    fireEvent.press(loginButton)

    expect(analytics.logOnboardingGeolocationClicked).toHaveBeenNthCalledWith(1, {
      type: 'skipped',
    })
  })
})
