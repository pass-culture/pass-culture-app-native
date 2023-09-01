import React from 'react'

import { SearchVenueItemDetails } from 'features/search/components/SearchVenueItemsDetails/SearchVenueItemDetails'
import { render, screen } from 'tests/utils'

const props = {
  width: 300,
  name: 'Test Venue',
  shortAddress: 'Paris, 75000',
  height: 172,
}

describe('SearchVenueItemDetails', () => {
  it('should render venue details correctly', () => {
    render(<SearchVenueItemDetails {...props} />)

    expect(screen.getByText(props.name)).toBeOnTheScreen()
    expect(screen.getByText(props.shortAddress)).toBeOnTheScreen()
  })
})
