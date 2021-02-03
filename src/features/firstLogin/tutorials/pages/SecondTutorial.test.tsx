import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { SecondTutorial } from 'features/firstLogin/tutorials/pages/SecondTutorial'

import { navigate } from '../../../../../__mocks__/@react-navigation/native'

describe('SecondTutorial page', () => {
  it('should display animation', async () => {
    const firstTutorial = render(<SecondTutorial />)
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should go to home when clicking skip tutorial button', () => {
    const { getByText } = render(<SecondTutorial />)

    const skipTutorials = getByText('Tout passer')
    fireEvent.press(skipTutorials)

    expect(navigate).toBeCalledWith('TabNavigator')
  })

  it('should navigate to third tutorial when clicking next button', () => {
    const { getByText } = render(<SecondTutorial />)

    const nextButton = getByText('Continuer')
    fireEvent.press(nextButton)

    expect(navigate).toBeCalledWith('ThirdTutorial')
  })
})
