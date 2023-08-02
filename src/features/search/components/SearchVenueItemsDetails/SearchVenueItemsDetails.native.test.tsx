import React from 'react'

import { SearchVenueItemsDetails } from 'features/search/components/SearchVenueItemsDetails/SearchVenueItemsDetails'
import { render, screen } from 'tests/utils'

const props = {
  width: 300,
  name: 'Test Venue',
  city: 'Test City',
}

describe('SearchVenueItemsDetails', () => {
  it('should render venue details correctly', () => {
    render(<SearchVenueItemsDetails {...props} />)

    expect(screen.getByText(props.name)).toBeTruthy()
    expect(screen.getByText(props.city)).toBeTruthy()
  })
})
