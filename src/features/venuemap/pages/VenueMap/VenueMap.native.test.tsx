import React from 'react'

import { VenueMap } from 'features/venuemap/pages/VenueMap/VenueMap'
import { render, screen } from 'tests/utils'

describe('<VenueMap />', () => {
  it('Should display venue map header', () => {
    render(<VenueMap />)

    expect(screen.getByText('Carte des lieux')).toBeOnTheScreen()
  })
})
