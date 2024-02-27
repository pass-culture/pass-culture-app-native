import React from 'react'

import { MApPinWithCounter } from 'features/venuemap/components/MapPinWithCounter/MapPinWithCounter'
import { render, screen } from 'tests/utils'

describe('<MApPinWithCounter />', () => {
  it('should display the number of venues in the cluster', () => {
    render(<MApPinWithCounter count={50} />)

    expect(screen.getByText('50')).toBeOnTheScreen()
  })

  it('should display the number of venues in the cluster with 99+ when count informed and is greater than 99', () => {
    render(<MApPinWithCounter count={100} />)

    expect(screen.getByText('99+')).toBeOnTheScreen()
  })
})
