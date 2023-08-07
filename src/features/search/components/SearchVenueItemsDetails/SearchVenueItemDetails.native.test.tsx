import React from 'react'

import { SearchVenueItemDetails } from 'features/search/components/SearchVenueItemsDetails/SearchVenueItemDetails'
import { render, screen } from 'tests/utils'

const props = {
  width: 300,
  name: 'Test Venue',
  city: 'Test City',
}

describe('SearchVenueItemDetails', () => {
  it('should render venue details correctly', () => {
    render(<SearchVenueItemDetails {...props} />)

    expect(screen.getByText(props.name)).toBeTruthy()
    expect(screen.getByText(props.city)).toBeTruthy()
  })
})
