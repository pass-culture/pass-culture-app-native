import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AutocompleteVenueItem } from 'features/search/components/AutocompleteVenueItem/AutocompleteVenueItem'
import { mockVenueHits } from 'features/search/fixtures/algolia'
import { fireEvent, render, screen } from 'tests/utils'

describe('AutocompleteVenueItem component', () => {
  it('should render AutocompleteVenueItem', () => {
    expect(render(<AutocompleteVenueItem hit={mockVenueHits[0]} />)).toMatchSnapshot()
  })

  it('should create a suggestion clicked event when pressing a hit', async () => {
    render(<AutocompleteVenueItem hit={mockVenueHits[0]} />)
    await fireEvent.press(screen.getByTestId('autocompleteVenueItem'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'Venue', { id: Number(mockVenueHits[0].objectID) })
  })
})
