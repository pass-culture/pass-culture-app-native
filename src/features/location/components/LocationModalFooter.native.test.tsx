import React from 'react'

import { LocationModalFooter } from 'features/location/components/LocationModalFooter'
import { render, screen } from 'tests/utils'

describe('<LocationModalFooter />', () => {
  it('should display "Valider la localisation" by default on button', () => {
    render(<LocationModalFooter onSubmit={jest.fn()} />)

    expect(screen.getByText('Valider la localisation')).toBeOnTheScreen()
  })

  it('should display button wording when defined', () => {
    render(<LocationModalFooter onSubmit={jest.fn()} buttonWording="Valider ma position" />)

    expect(screen.getByText('Valider ma position')).toBeOnTheScreen()
  })
})
