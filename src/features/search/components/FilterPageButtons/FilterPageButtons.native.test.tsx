import React from 'react'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { FilterBehaviour } from 'features/search/enums'
import { render, screen, userEvent } from 'tests/utils'

const onResetPress = jest.fn()
const onSearchPress = jest.fn()
const user = userEvent.setup()
jest.useFakeTimers()

describe('FilterPageButtons', () => {
  it('should call button action when pressing reset button', async () => {
    render(
      <FilterPageButtons
        onSearchPress={onSearchPress}
        onResetPress={onResetPress}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
    )

    const resetButton = screen.getByText('Réinitialiser')
    await user.press(resetButton)

    expect(onResetPress).toHaveBeenCalledTimes(1)
  })

  it('should call button action when pressing search button', async () => {
    render(
      <FilterPageButtons
        onSearchPress={onSearchPress}
        onResetPress={onResetPress}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
    )

    const searchButton = screen.getByText('Rechercher')
    await user.press(searchButton)

    expect(onSearchPress).toHaveBeenCalledTimes(1)
  })

  it('should call button action when pressing apply filter button', async () => {
    render(
      <FilterPageButtons
        onSearchPress={onSearchPress}
        onResetPress={onResetPress}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
      />
    )

    const searchButton = screen.getByText('Appliquer le filtre')
    await user.press(searchButton)

    expect(onSearchPress).toHaveBeenCalledTimes(1)
  })
})
