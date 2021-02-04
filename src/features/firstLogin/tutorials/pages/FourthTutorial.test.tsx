import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { FourthTutorial } from 'features/firstLogin/tutorials/pages/FourthTutorial'

import { navigate } from '../../../../../__mocks__/@react-navigation/native'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('<FourthTutorial />', () => {
  it('should correctly display', () => {
    const renderAPI = render(<FourthTutorial />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should go to home when clicking skip tutorial button', () => {
    const renderAPI = render(<FourthTutorial />)

    const skipTutorialsButton = renderAPI.getByText('Tout passer')
    fireEvent.press(skipTutorialsButton)

    expect(navigate).toBeCalledWith('TabNavigator')
  })

  it('should go to home when clicking "Découvrir" button', () => {
    const renderAPI = render(<FourthTutorial />)

    const button = renderAPI.getByText('Découvrir')
    fireEvent.press(button)

    expect(navigate).toBeCalledWith('TabNavigator')
  })
})
