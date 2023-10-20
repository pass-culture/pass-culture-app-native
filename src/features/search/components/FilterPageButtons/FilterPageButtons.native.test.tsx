import React from 'react'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { FilterBehaviour } from 'features/search/enums'
import { fireEvent, render, screen } from 'tests/utils'

const onResetPress = jest.fn()
const onSearchPress = jest.fn()

describe('FilterPageButtons', () => {
  it('should call button action when pressing reset button', () => {
    render(
      <FilterPageButtons
        onSearchPress={onSearchPress}
        onResetPress={onResetPress}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
    )

    const resetButton = screen.getByText('Réinitialiser')
    fireEvent.press(resetButton)

    expect(onResetPress).toHaveBeenCalledTimes(1)
  })

  it('should call button action when pressing search button', () => {
    render(
      <FilterPageButtons
        onSearchPress={onSearchPress}
        onResetPress={onResetPress}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
    )

    const searchButton = screen.getByText('Rechercher')
    fireEvent.press(searchButton)

    expect(onSearchPress).toHaveBeenCalledTimes(1)
  })

  it('should call button action when pressing apply filter button', () => {
    render(
      <FilterPageButtons
        onSearchPress={onSearchPress}
        onResetPress={onResetPress}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
      />
    )

    const searchButton = screen.getByText('Appliquer le filtre')
    fireEvent.press(searchButton)

    expect(onSearchPress).toHaveBeenCalledTimes(1)
  })
})
