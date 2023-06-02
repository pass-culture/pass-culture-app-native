import React from 'react'
import { Animated } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { fireEvent, render, screen } from 'tests/utils'

const animatedValue = new Animated.Value(0)
const HeaderInterpolation = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 1],
})

describe('DefaultThematicHomeHeader', () => {
  it('should navigate to home page on press go back button', () => {
    render(<DefaultThematicHomeHeader headerTitle="toto" headerTransition={HeaderInterpolation} />)
    const backButton = screen.getByTestId('Revenir en arrière')

    fireEvent.press(backButton)

    expect(navigate).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
})
