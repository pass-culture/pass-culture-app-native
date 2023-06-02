import React from 'react'

import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { render, screen } from 'tests/utils'

describe('DefaultThematicHomeHeader', () => {
  it('should show title and sub title if render correctly', async () => {
    render(<DefaultThematicHomeHeader headerSubtitle={'Un sous-titre'} headerTitle={'Un titre'} />)
    expect(await screen.findByText('Un titre')).toBeTruthy()
    expect(screen.getByText('Un sous-titre')).toBeTruthy()
  })
})
