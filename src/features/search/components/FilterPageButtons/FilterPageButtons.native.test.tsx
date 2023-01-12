import React from 'react'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { fireEvent, render } from 'tests/utils'

const onResetPress = jest.fn()
const onSearchPress = jest.fn()

describe('FilterPageButtons', () => {
  it('should call button action when pressing reset button', () => {
    const { getByText } = render(
      <FilterPageButtons onSearchPress={onSearchPress} onResetPress={onResetPress} />
    )
    const resetButton = getByText('Réinitialiser')
    fireEvent.press(resetButton)

    expect(onResetPress).toHaveBeenCalledWith()
  })

  it('should call button action when pressing search button', () => {
    const { getByText } = render(
      <FilterPageButtons
        onSearchPress={onSearchPress}
        onResetPress={onResetPress}
        willTriggerSearch
      />
    )
    const searchButton = getByText('Rechercher')
    fireEvent.press(searchButton)

    expect(onSearchPress).toHaveBeenCalledWith()
  })

  it('should show alternative button label when we apply filters without trigger search', () => {
    const { getByText } = render(
      <FilterPageButtons onSearchPress={onSearchPress} onResetPress={onResetPress} />
    )

    expect(getByText('Appliquer le filtre')).toBeTruthy()
  })
})
