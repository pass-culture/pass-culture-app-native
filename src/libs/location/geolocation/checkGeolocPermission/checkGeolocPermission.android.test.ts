/* eslint-disable local-rules/independent-mocks */
import { Platform } from 'react-native'
import { checkMultiple, Permission, PERMISSIONS } from 'react-native-permissions'

import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission.android'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'

type PermissionValue = 'unavailable' | 'blocked' | 'denied' | 'granted' | 'limited'
type Permissions = Record<Permission, PermissionValue>
jest.mock('react-native-permissions', () => ({
  checkMultiple: jest.fn(),
  PERMISSIONS: {
    ANDROID: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
      ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
    },
  },
}))
const mockCheckMultiple = jest.mocked(checkMultiple)

describe('checkGeolocPermission()', () => {
  Platform.OS = 'android'

  it.each`
    ACCESS_FINE_LOCATION | ACCESS_COARSE_LOCATION | expectedState
    ${'granted'}         | ${'granted'}           | ${GeolocPermissionState.GRANTED}
    ${'granted'}         | ${'denied'}            | ${GeolocPermissionState.GRANTED}
    ${'denied'}          | ${'granted'}           | ${GeolocPermissionState.GRANTED}
    ${'denied'}          | ${'denied'}            | ${GeolocPermissionState.NEVER_ASK_AGAIN}
  `(
    'should return $expectedState when ACCESS_FINE_LOCATION=$ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION=$ACCESS_COARSE_LOCATION',
    async ({
      ACCESS_FINE_LOCATION,
      ACCESS_COARSE_LOCATION,
      expectedState,
    }: {
      ACCESS_FINE_LOCATION: PermissionValue
      ACCESS_COARSE_LOCATION: PermissionValue
      expectedState: GeolocPermissionState
    }) => {
      mockCheckMultiple.mockResolvedValue({
        [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]: ACCESS_FINE_LOCATION,
        [PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]: ACCESS_COARSE_LOCATION,
      } as Permissions)
      const permission = await checkGeolocPermission()

      expect(permission).toEqual(expectedState)
    }
  )
})
