import React from 'react'

import { CategoryThematicHomeSubHeader } from 'features/home/components/headers/CategoryThematicHomeSubHeader'
import { render, screen } from 'tests/utils'

describe('CategoryThematicHomeHeader', () => {
  it('WIP', async () => {
    render(
      <CategoryThematicHomeSubHeader
        imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
        subtitle={'Un sous-titre'}
        title={'Un titre'}
      />
    )
    expect(await screen.findByText('Un titre')).toBeTruthy()
    expect(screen.getByText('Un sous-titre')).toBeTruthy()
  })
})
