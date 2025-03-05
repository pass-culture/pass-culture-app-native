import React from 'react'

import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { render, screen } from 'tests/utils'

import { FilterBannerContainer } from './FilterBannerContainer'

describe('FilterBannerContainer', () => {
  it('should render correctly', async () => {
    render(<FilterBannerContainer />)
    await screen.findAllByTestId(/[A-Z]+Label/)

    Object.keys(FILTERS_VENUE_TYPE_MAPPING).forEach((id) => {
      expect(screen.getByTestId(`${id}Label`)).toBeOnTheScreen()
    })
  })
})
