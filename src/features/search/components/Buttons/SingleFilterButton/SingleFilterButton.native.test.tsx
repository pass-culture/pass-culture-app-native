import React from 'react'

import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()

const mockedOnPress = jest.fn()

describe('SingleFilterButton', () => {
  it('should execute onPress function when the button is clicked', async () => {
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

  it('should display an icon and change color in filter button when filter is applied', () => {
    render(
      <SingleFilterButton
        label="CD, vinyles, musique en ligne"
        onPress={mockedOnPress}
        testID="filterButton"
        isSelected
      />
    )
    const button = screen.getByTestId('CD, vinyles, musique en ligne\u00a0: Filtre sélectionné')

    expect(button).toHaveStyle({
      borderWidth: 2,
      backgroundColor: '#F1F1F4',
    })
  })
})
