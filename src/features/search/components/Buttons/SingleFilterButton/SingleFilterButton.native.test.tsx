import React from 'react'

import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { userEvent, render, screen } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()

describe('SingleFilterButton', () => {
  it('should execute onPress function when the button is clicked', async () => {
    const mockedOnPress = jest.fn()

    render(
      <SingleFilterButton
        label="CD, vinyles, musique en ligne"
        onPress={mockedOnPress}
        testID="filterButton"
        isSelected
      />
    )

    const button = screen.getByTestId('CD, vinyles, musique en ligne\u00a0: Filtre sélectionné')
    await user.press(button)

    expect(mockedOnPress).toHaveBeenCalledTimes(1)
  })
})
