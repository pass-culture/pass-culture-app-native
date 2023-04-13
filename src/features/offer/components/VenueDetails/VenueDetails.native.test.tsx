import React from 'react'

import { render, screen } from 'tests/utils'

import { VenueDetails } from './VenueDetails'

describe('<VenueDetails />', () => {
  it('should show distance tag when distance given', () => {
    render(
      <VenueDetails
        venueType={null}
        title="Jest"
        address="Somewhere in you memory"
        distance="300m"
      />
    )

    expect(screen.getByText(/300m/)).toBeTruthy()
  })

  it('should hide distance tag when distance given', () => {
    render(<VenueDetails venueType={null} title="Jest" address="Somewhere in you memory" />)

    expect(screen.queryByText(/300m/)).toBeFalsy()
  })

  it('should show image when image given', () => {
    render(
      <VenueDetails
        venueType={null}
        title="Jest"
        address="Somewhere in you memory"
        imageUrl="https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg"
      />
    )

    expect(screen.getByTestId('venue-image')).toBeTruthy()
  })

  it('should show placeholder image when no image given', () => {
    render(<VenueDetails venueType={null} title="Jest" address="Somewhere in you memory" />)

    expect(screen.queryByTestId('venue-image')).toBeFalsy()
    expect(screen.getByTestId('image-placeholder')).toBeTruthy()
  })
})
