import React from 'react'

import { MapPinWithCounter } from 'features/venuemap/components/MapPinWithCounter/MapPinWithCounter'
import { render, screen } from 'tests/utils'

describe('<MapPinWithCounter />', () => {
  it('should display the number of venues in the cluster', () => {
    render(<MapPinWithCounter count={50} />)

    expect(screen.getByText('50')).toBeOnTheScreen()
  })

  it('should display the number of venues in the cluster with 99+ when count informed and is greater than 99', () => {
    render(<MapPinWithCounter count={100} />)

    expect(screen.getByText('99+')).toBeOnTheScreen()
  })
})
