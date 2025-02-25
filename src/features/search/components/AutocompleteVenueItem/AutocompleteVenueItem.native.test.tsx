import React from 'react'

import { AutocompleteVenueItem } from 'features/search/components/AutocompleteVenueItem/AutocompleteVenueItem'
import { mockVenueHits } from 'features/search/fixtures/algolia'
import { render, screen, userEvent } from 'tests/utils'

jest.useFakeTimers()

describe('AutocompleteVenueItem component', () => {
  it('should call onPress on press', async () => {
    const pressHandler = jest.fn()

    render(<AutocompleteVenueItem hit={mockVenueHits[0]} onPress={pressHandler} />)

    await userEvent.setup().press(screen.getByTestId('autocompleteVenueItem_9898'))

    expect(pressHandler).toHaveBeenCalledTimes(1)
  })
})
