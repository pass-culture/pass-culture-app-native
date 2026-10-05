import React from 'react'

import { CategoriesListDumb } from 'features/search/components/CategoriesListDumb/CategoriesListDumb'
import { SEARCH_CATEGORIES_ANCHOR_ID } from 'features/search/constants'
import { render, screen } from 'tests/utils/web'

describe('CategoriesListDumb', () => {
  it('should not display venue map block when is "web"', () => {
    render(
      <CategoriesListDumb
        sortedCategories={[]}
        shouldDisplayVenueMap={false}
        isMapWithoutPositionAndNotLocated={false}
        onPressVenueMap={jest.fn()}
      />
    )

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })

  it('should expose the categories title as a focusable quick access target', () => {
    render(
      <CategoriesListDumb
        sortedCategories={[]}
        shouldDisplayVenueMap={false}
        isMapWithoutPositionAndNotLocated={false}
        onPressVenueMap={jest.fn()}
      />
    )

    const anchor = screen.getByText('Parcours les catégories').parentElement

    expect(anchor).toHaveAttribute('id', SEARCH_CATEGORIES_ANCHOR_ID)
    expect(anchor).toHaveAttribute('tabindex', '-1')
  })
})
