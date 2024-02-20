import React from 'react'

import { CategoriesButtonsDisplay } from 'features/search/components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'
import { render, screen } from 'tests/utils/web'

describe('CategoriesButtonsDisplay', () => {
  it('should not display venue map block when is "web"', () => {
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })
})
