import React from 'react'
import { Animated } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { fireEvent, render, screen } from 'tests/utils'

const animatedValue = new Animated.Value(0)
const HeaderInterpolation = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 1],
})

describe('CategoryThematicHomeHeader', () => {
  it('should navigate to home page on press go back button', () => {
    render(
      <CategoryThematicHomeHeader
        imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
        subtitle={'Un sous-titre'}
        title={'Un titre'}
        headerTransition={HeaderInterpolation}
      />
    )
    const backButton = screen.getByTestId('Revenir en arrière')

    fireEvent.press(backButton)

    expect(navigate).toHaveBeenCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
})
