import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OnboardingGeolocation } from 'features/onboarding/pages/OnboardingGeolocation'
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

    expect(navigate).toHaveBeenCalledWith('AgeSelection')
  })

  it('should request geoloc permission when "Utiliser ma position" is clicked', async () => {
    const { getByLabelText } = render(<OnboardingGeolocation />)

    const loginButton = getByLabelText('Utiliser ma position')
    fireEvent.press(loginButton)

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })
})
