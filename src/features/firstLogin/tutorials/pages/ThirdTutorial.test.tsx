import { render, fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { Alert } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { ThirdTutorial } from 'features/firstLogin/tutorials/pages/ThirdTutorial'
import { GeolocationWrapper } from 'libs/geolocation'

import { navigate } from '../../../../../__mocks__/@react-navigation/native'

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

  it('should call Alert.alert when permission is granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('granted')
    const renderAPI = render(
      <GeolocationWrapper>
        <ThirdTutorial />
      </GeolocationWrapper>
    )

    fireEvent.press(renderAPI.getByText('Activer la géolocalisation'))

    await waitFor(() => {
      expect(Alert.alert).toBeCalled()
    })
  })

  it('should call Alert.alert when permission is denied', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('denied')
    const renderAPI = render(
      <GeolocationWrapper>
        <ThirdTutorial />
      </GeolocationWrapper>
    )

    fireEvent.press(renderAPI.getByText('Activer la géolocalisation'))

    await waitFor(() => {
      expect(Alert.alert).toBeCalled()
    })
  })
})
