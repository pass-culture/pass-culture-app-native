import React from 'react'

import { render, screen } from 'tests/utils'

import { VenueBlockSkeleton } from './VenueBlockSkeleton'

describe('<VenueBlockSkeleton />', () => {
  it('should render the VenueBlockSkeleton component', () => {
    render(<VenueBlockSkeleton />)

    expect(screen.getByTestId('venue-block-skeleton-container')).toBeOnTheScreen()
  })
})
