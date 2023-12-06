import React from 'react'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { GeoCoordinates, GeolocationError, GeolocPermissionState, Position } from 'libs/location'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('features/favorites/context/FavoritesWrapper', () =>
  jest.requireActual('features/favorites/context/FavoritesWrapper')
)

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates
const mockPermissionState = GeolocPermissionState.GRANTED
const mockPosition: Position = DEFAULT_POSITION
const mockPositionError: GeolocationError | null = null

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    permissionState: mockPermissionState,
    userPosition: mockPosition,
    userPositionError: mockPositionError,
    triggerPositionUpdate: jest.fn(),
    showGeolocPermissionModal: jest.fn(),
    requestGeolocPermission: jest.fn(),
  }),
}))

describe('<FavoritesSorts/>', () => {
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
