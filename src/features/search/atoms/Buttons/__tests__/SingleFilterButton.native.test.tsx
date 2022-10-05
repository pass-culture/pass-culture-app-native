import React from 'react'

import { SingleFilterButton } from 'features/search/atoms/Buttons/FilterButton/SingleFilterButton'
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

    const button = getByTestId('filterButton')
    fireEvent.press(button)

    expect(mockedOnPress).toHaveBeenCalledTimes(1)
  })
})
