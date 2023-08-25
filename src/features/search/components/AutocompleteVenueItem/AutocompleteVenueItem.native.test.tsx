import React from 'react'

import { AutocompleteVenueItem } from 'features/search/components/AutocompleteVenueItem/AutocompleteVenueItem'
import { mockVenueHits } from 'features/search/fixtures/algolia'
import { fireEvent, render, screen } from 'tests/utils'

describe('AutocompleteVenueItem component', () => {
  it('should render AutocompleteVenueItem', () => {
    expect(
      render(<AutocompleteVenueItem hit={mockVenueHits[0]} onPress={jest.fn()} />)
    ).toMatchSnapshot()
  })

  it('should call onPress on press', async () => {
    const pressHandler = jest.fn()

    render(<AutocompleteVenueItem hit={mockVenueHits[0]} onPress={pressHandler} />)

    await fireEvent.press(screen.getByTestId('autocompleteVenueItem_9898'))

    expect(pressHandler).toHaveBeenCalledTimes(1)
  })
})
