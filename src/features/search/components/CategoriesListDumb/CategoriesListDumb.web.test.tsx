import React from 'react'

import { CategoriesListDumb } from 'features/search/components/CategoriesListDumb/CategoriesListDumb'
import { render, screen } from 'tests/utils/web'

describe('CategoriesListDumb', () => {
  it('should not display venue map block when is "web"', () => {
    render(
      <CategoriesListDumb
        sortedCategories={[]}
        shouldDisplayVenueMap={false}
        isMapWithoutPositionAndNotLocated={false}
        showVenueMapLocationModal={jest.fn()}
        venueMapLocationModalVisible={false}
        hideVenueMapLocationModal={jest.fn()}
      />
    )

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })
})
