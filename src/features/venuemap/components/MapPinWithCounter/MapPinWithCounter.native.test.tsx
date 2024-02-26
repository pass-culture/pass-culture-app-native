import React from 'react'

import { MApPinWithCounter } from 'features/venuemap/components/MapPinWithCounter/MapPinWithCounter'
import { render, screen } from 'tests/utils'

describe('<MApPinWithCounter />', () => {
  it('should not display number container when count not informed', () => {
    render(<MApPinWithCounter />)

    expect(screen.queryByTestId('numberContainer')).not.toBeOnTheScreen()
  })

  it('should not display number container when count informed and is equal to 0', () => {
    render(<MApPinWithCounter count={0} />)

    expect(screen.queryByTestId('numberContainer')).not.toBeOnTheScreen()
  })

  it('should not display number container when count informed and is equal to 1', () => {
    render(<MApPinWithCounter count={1} />)

    expect(screen.queryByTestId('numberContainer')).not.toBeOnTheScreen()
  })

  it('should display the number of venues in the cluster when count informed and is greater than 1', () => {
    render(<MApPinWithCounter count={50} />)

    expect(screen.getByText('50')).toBeOnTheScreen()
  })

  it('should display the number of venues in the cluster with 99+ when count informed and is greater than 99', () => {
    render(<MApPinWithCounter count={100} />)

    expect(screen.getByText('99+')).toBeOnTheScreen()
  })
})
