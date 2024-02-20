import React from 'react'

import { VenueMapPin } from 'features/search/components/VenueMapPin/VenueMapPin'
import { render, screen } from 'tests/utils'

describe('<VenueMapPin />', () => {
  it('should not display number container when count not informed', () => {
    render(<VenueMapPin />)

    expect(screen.queryByTestId('numberContainer')).not.toBeOnTheScreen()
  })

  it('should display the number of venues in the cluster when count informed', () => {
    render(<VenueMapPin count={50} />)

    expect(screen.getByText('50')).toBeOnTheScreen()
  })

  it('should display the number of venues in the cluster with 99+ when count informed and is greater than 99', () => {
    render(<VenueMapPin count={100} />)

    expect(screen.getByText('99+')).toBeOnTheScreen()
  })
})
