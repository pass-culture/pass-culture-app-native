import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Alert } from 'react-native'

import { ThirdTutorial } from 'features/firstLogin/tutorials/pages/ThirdTutorial'

import { navigate } from '../../../../../__mocks__/@react-navigation/native'

describe('<ThirdTutorial />', () => {
  it('should display animation', async () => {
    const renderAPI = render(<ThirdTutorial />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should go to home when clicking skip tutorial button', () => {
    const renderAPI = render(<ThirdTutorial />)

    const skipTutorialsButton = renderAPI.getByText('Tout passer')
    fireEvent.press(skipTutorialsButton)

    expect(navigate).toBeCalledWith('TabNavigator')
  })

  it('should show Alert when clicking "Activer la géolocalisation" button', () => {
    const renderAPI = render(<ThirdTutorial />)

    const nextButton = renderAPI.getByText('Activer la géolocalisation')
    fireEvent.press(nextButton)

    expect(Alert.alert).toBeCalled()
  })
})
