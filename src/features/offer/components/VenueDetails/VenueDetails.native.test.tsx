import React from 'react'

import { render, screen } from 'tests/utils'

import { VenueDetails } from './VenueDetails'

describe('<VenueDetails />', () => {
  it('should show distance tag when distance given', () => {
    render(<VenueDetails title="Jest" address="Somewhere in you memory" distance="300m" />)

    expect(screen.getByText(/300m/)).toBeOnTheScreen()
  })

  it('should hide distance tag when no distance given', () => {
    render(<VenueDetails title="Jest" address="Somewhere in you memory" />)

    expect(screen.queryByText(/300m/)).toBeFalsy()
  })
})
