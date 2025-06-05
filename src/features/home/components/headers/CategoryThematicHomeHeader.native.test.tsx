import React from 'react'

import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { Color } from 'features/home/types'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('CategoryThematicHomeHeader', () => {
  it('should show title and subtitle if render correctly', async () => {
    render(
      <CategoryThematicHomeHeader
        subtitle="Un sous-titre"
        title="Un titre"
        color={Color.Aquamarine}
      />
    )

    expect(await screen.findByText('Un titre')).toBeOnTheScreen()
    expect(screen.getByText('Un sous-titre')).toBeOnTheScreen()
  })
})
