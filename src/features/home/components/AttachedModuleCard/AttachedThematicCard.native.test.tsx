import React from 'react'

import { AttachedThematicCard } from 'features/home/components/AttachedModuleCard/AttachedThematicCard'
import { render, screen } from 'tests/utils'

describe('AttachedThematicCard', () => {
  it('should display date if offer has one', () => {
    render(<AttachedThematicCard title="title" subtitle="17 novembre 2020" />)

    const date = screen.getByText(`17 novembre 2020`)

    expect(date).toBeOnTheScreen()
  })

  it('should have accessibilityLabel', () => {
    render(<AttachedThematicCard title="title" subtitle="du 15/09 au 12/12" label="Cinéma" />)

    const card = screen.getByLabelText(
      'Découvre le temps fort "title" du 15/09 au 12/12 sur le thème "Cinéma".'
    )

    expect(card).toBeOnTheScreen()
  })
})
