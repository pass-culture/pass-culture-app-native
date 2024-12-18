import React from 'react'

import { DumbCategoriesList } from 'features/search/components/DumbCategoriesList/DumbCategoriesList'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils/web'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('DumbCategoriesList', () => {
  it('should not display venue map block when is "web"', () => {
    render(
      <DumbCategoriesList
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
