import React from 'react'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { FilterBehaviour } from 'features/search/enums'
import { fireEvent, render } from 'tests/utils'

const onResetPress = jest.fn()
const onSearchPress = jest.fn()

describe('FilterPageButtons', () => {
  it('should call button action when pressing reset button', () => {
    const { getByText } = render(
      <FilterPageButtons
        onSearchPress={onSearchPress}
        onResetPress={onResetPress}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
    )
    const resetButton = getByText('Réinitialiser')
    fireEvent.press(resetButton)

    expect(onResetPress).toHaveBeenCalledTimes(1)
  })

  it('should call button action when pressing search button', () => {
    const { getByText } = render(
      <FilterPageButtons
        onSearchPress={onSearchPress}
        onResetPress={onResetPress}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
    )
    const searchButton = getByText('Rechercher')
    fireEvent.press(searchButton)

    expect(onSearchPress).toHaveBeenCalledTimes(1)
  })

  it('should call button action when pressing apply filter button', () => {
    const { getByText } = render(
      <FilterPageButtons
        onSearchPress={onSearchPress}
        onResetPress={onResetPress}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
      />
    )

    const searchButton = getByText('Appliquer le filtre')
    fireEvent.press(searchButton)

    expect(onSearchPress).toHaveBeenCalledTimes(1)
  })
})
