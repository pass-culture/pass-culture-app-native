import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils'

describe('CategoryThematicHomeHeader', () => {
  it('should navigate to home page on press go back button', () => {
    const { getByTestId } = render(
      <CategoryThematicHomeHeader
        imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
        subtitle={'Un sous-titre'}
        title={'Un titre'}
      />
    )
    const backButton = getByTestId('Revenir en arrière')

    fireEvent.press(backButton)

    expect(navigate).toHaveBeenCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
})
