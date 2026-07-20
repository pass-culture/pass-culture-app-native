import React from 'react'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { checkAccessibilityFor, render } from 'tests/utils/web'

const DEFAULT_POSITION = { latitude: 66, longitude: 66 }

describe('<FavoritesSorts/>', () => {
  beforeEach(() => {
    useLocationV2.setState(defaultLocationState)
    locationActions.setGeolocPosition(DEFAULT_POSITION)
    locationActions.setPermissionState(GeolocPermissionState.GRANTED)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderFavoritesSort()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

function renderFavoritesSort() {
  return render(
    <FavoritesWrapper>
      <FavoritesSorts />
    </FavoritesWrapper>
  )
}
