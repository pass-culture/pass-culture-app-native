import React from 'react'

import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { GeolocPermissionState, GeolocationError, GeoCoordinates } from 'libs/geolocation'
import { superFlushWithAct, render, checkAccessibilityFor } from 'tests/utils/web'

jest.mock('features/favorites/context/FavoritesWrapper', () =>
  jest.requireActual('features/favorites/context/FavoritesWrapper')
)

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates
const mockPermissionState = GeolocPermissionState.GRANTED
const mockPosition: GeoCoordinates | null = DEFAULT_POSITION
const mockPositionError: GeolocationError | null = null

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
    position: mockPosition,
    positionError: mockPositionError,
    triggerPositionUpdate: jest.fn(),
    showGeolocPermissionModal: jest.fn(),
    requestGeolocPermission: jest.fn(),
  }),
}))

describe('<FavoritesSorts/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = await renderFavoritesSort()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

async function renderFavoritesSort() {
  const renderAPI = render(
    <FavoritesWrapper>
      <FavoritesSorts />
    </FavoritesWrapper>
  )
  await superFlushWithAct()
  return renderAPI
}
