import React from 'react'

import { AttachedThematicCard } from 'features/home/components/AttachedModuleCard/AttachedThematicCard'
import { render, screen } from 'tests/utils'

describe('AttachedThematicCard', () => {
  it('should display date if offer has one', () => {
    render(<AttachedThematicCard title="title" subtitle="17 novembre 2020" />)

    const date = screen.getByText(`17 novembre 2020`)

    expect(date).toBeOnTheScreen()
  })
})
