import { GeolocPermissionState } from 'libs/location/geolocation/enums'

import { checkGeolocPermission } from './checkGeolocPermission'

let mockQuery = jest.mocked(navigator.permissions.query)
const initialNavigatorPermissions = { ...navigator.permissions }
function resetNavigatorPermissions() {
  // @ts-expect-error : `permissions` is a read-only property
  global.navigator.permissions = initialNavigatorPermissions
  mockQuery = jest.mocked(initialNavigatorPermissions.query)
}

describe('checkGeolocPermission()', () => {
  afterEach(resetNavigatorPermissions)

  it.each`
    permissionStatus                            | expectedState                            | isPermissionAPIUndefined
    ${{ state: 'granted' } as PermissionStatus} | ${GeolocPermissionState.GRANTED}         | ${false}
    ${{ state: 'denied' } as PermissionStatus}  | ${GeolocPermissionState.NEVER_ASK_AGAIN} | ${false}
    ${{ state: 'prompt' } as PermissionStatus}  | ${GeolocPermissionState.DENIED}          | ${false}
  `(
    'should return $expectedState when permissionStatus=$permissionStatus and isPermissionAPIUndefined=$isPermissionAPIUndefined',
    async ({
      permissionStatus,
      expectedState,
    }: {
      permissionStatus: PermissionStatus
      expectedState: GeolocPermissionState
    }) => {
      mockQuery.mockResolvedValueOnce(permissionStatus)
      const state = await checkGeolocPermission()

      expect(mockQuery).toHaveBeenCalledTimes(1)
      expect(state).toEqual(expectedState)
    }
  )
})
