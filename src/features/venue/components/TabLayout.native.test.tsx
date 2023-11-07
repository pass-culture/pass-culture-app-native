import React from 'react'

import { TabLayout } from 'features/venue/components/TabLayout'
import { fireEvent, render, screen } from 'tests/utils'

describe('TabLayout', () => {
  it('should render first tab content by default', () => {
    render(<TabLayout />)

    expect(screen.getByText('Offres disponibles content')).toBeOnTheScreen()
  })

  it('should render second tab content when clicking on the second tab title', () => {
    render(<TabLayout />)

    fireEvent.press(screen.getByText('Infos pratiques'))

    expect(screen.queryByText('Offres disponibles content')).not.toBeOnTheScreen()
    expect(screen.getByText('Infos pratiques content')).toBeOnTheScreen()
  })
})
