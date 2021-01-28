import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Alert } from 'react-native'

import { FirstTutorial } from 'features/tutorials/pages/FirstTutorial'

import { navigate } from '../../../../__mocks__/@react-navigation/native'

describe('FirstTutorial page', () => {
  it('should display animation', async () => {
    const firstTutorial = render(<FirstTutorial />)
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should go to home when clicking skip tutorial button', () => {
    const { getByText } = render(<FirstTutorial />)

    const skipTutorials = getByText('Tout passer')
    fireEvent.press(skipTutorials)

    expect(navigate).toBeCalledWith('Home', {
      shouldDisplayLoginModal: false,
    })
  })

  it('should show alert when clicking next button', () => {
    const { getByText } = render(<FirstTutorial />)

    const nextButton = getByText('Continuer')
    fireEvent.press(nextButton)

    expect(Alert.alert).toBeCalled()
  })
})
