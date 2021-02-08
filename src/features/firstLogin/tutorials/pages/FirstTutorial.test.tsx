import AsyncStorage from '@react-native-community/async-storage'
import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { FirstTutorial } from 'features/firstLogin/tutorials/pages/FirstTutorial'

import { navigate } from '../../../../../__mocks__/@react-navigation/native'

describe('FirstTutorial page', () => {
  it('should display animation', async () => {
    const firstTutorial = render(<FirstTutorial />)
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should go to home when clicking skip tutorial button', () => {
    const { getByText } = render(<FirstTutorial />)

    const skipTutorials = getByText('Tout passer')
    fireEvent.press(skipTutorials)

    expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
    expect(navigate).toBeCalledWith('TabNavigator')
  })

  it('should navigate to second tutorial when clicking next button', () => {
    const { getByText } = render(<FirstTutorial />)

    const nextButton = getByText('Continuer')
    fireEvent.press(nextButton)

    expect(navigate).toBeCalledWith('SecondTutorial')
  })
})
