import React from 'react'

import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { fireEvent, render } from 'tests/utils'

describe('SingleFilterButton', () => {
  it('should execute onPress function when the button is clicked', () => {
    const mockedOnPress = jest.fn()
    const { getByTestId } = render(
      <SingleFilterButton
        label="CD, vinyles, musique en ligne"
        onPress={mockedOnPress}
        testID="filterButton"
        isSelected
      />
    )

    const button = getByTestId('CD, vinyles, musique en ligne\u00a0: Filtre sélectionné')
    fireEvent.press(button)

    expect(mockedOnPress).toHaveBeenCalledTimes(1)
  })
})
