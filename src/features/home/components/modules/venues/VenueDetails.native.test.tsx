import React from 'react'

import { render, screen } from 'tests/utils'

import { VenueDetails } from './VenueDetails'

describe('VenueDetails component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(
      <VenueDetails name="Musée du Louvre" width={100} postalCode="75000" city="Paris" />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show formatted city and postalCode', () => {
    render(<VenueDetails name="Musée du Louvre" width={100} postalCode="75000" city="Paris" />)
    expect(screen.getByText('Paris, 75000')).toBeOnTheScreen()
  })
})
