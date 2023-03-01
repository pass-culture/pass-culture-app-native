import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils'

describe('DefaultThematicHomeHeader', () => {
  it('should navigate to home page on press go back button', () => {
    const { getByTestId } = render(<DefaultThematicHomeHeader headerTitle="toto" />)
    const backButton = getByTestId('Revenir en arrière')

    fireEvent.press(backButton)

    expect(navigate).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
})
