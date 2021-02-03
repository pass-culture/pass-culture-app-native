import { renderHook } from '@testing-library/react-hooks'
import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { ThirdTutorial } from 'features/firstLogin/tutorials/pages/ThirdTutorial'
import { useGeolocation } from 'libs/geolocation'

import { navigate } from '../../../../../__mocks__/@react-navigation/native'

jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn().mockReturnValue({
    requestGeolocPermission: jest.fn(),
  }),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('<ThirdTutorial />', () => {
  it('should display animation', () => {
    const renderAPI = render(<ThirdTutorial />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should go to home when clicking skip tutorial button', () => {
    const renderAPI = render(<ThirdTutorial />)

    const skipTutorialsButton = renderAPI.getByText('Tout passer')
    fireEvent.press(skipTutorialsButton)

    expect(navigate).toBeCalledWith('TabNavigator')
  })

  it('should called requestGeolocPermission when clicking "Activer la géolocalisation" button', () => {
    const hookResult = renderHook(useGeolocation)
    const renderAPI = render(<ThirdTutorial />)

    const nextButton = renderAPI.getByText('Activer la géolocalisation')
    fireEvent.press(nextButton)

    expect(hookResult.result.current.requestGeolocPermission).toBeCalled()
  })
})
