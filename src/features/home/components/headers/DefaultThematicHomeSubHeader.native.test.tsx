import React from 'react'

import { DefaultThematicHomeSubHeader } from 'features/home/components/headers/DefaultThematicHomeSubHeader'
import { render, screen } from 'tests/utils'

describe('DefaultThematicHomeHeader', () => {
  it('WIP', async () => {
    render(
      <DefaultThematicHomeSubHeader headerSubtitle={'Un sous-titre'} headerTitle={'Un titre'} />
    )
    expect(await screen.findByText('Un titre')).toBeTruthy()
    expect(screen.getByText('Un sous-titre')).toBeTruthy()
  })
})
