import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils'

describe('ThematicHomeHeader', () => {
  it('should navigate to home page on press go back button', () => {
    const { getByTestId } = render(<ThematicHomeHeader headerTitle="toto" />)
    const backButton = getByTestId('backButton')

    fireEvent.press(backButton)

    expect(navigate).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
})
