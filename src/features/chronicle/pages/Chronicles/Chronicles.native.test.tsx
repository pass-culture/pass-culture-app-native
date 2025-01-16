import React from 'react'

import { Chronicles } from 'features/chronicle/pages/Chronicles/Chronicles'
import { render, screen } from 'tests/utils'

describe('Chronicles', () => {
  it('should render correctly', () => {
    render(<Chronicles />)

    expect(screen.getByText('Tous les avis')).toBeOnTheScreen()
  })
})
