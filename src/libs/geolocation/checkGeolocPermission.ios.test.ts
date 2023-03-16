/* eslint-disable local-rules/independent-mocks */
import { Platform } from 'react-native'
import { check, RESULTS } from 'react-native-permissions'

import { checkGeolocPermission } from 'libs/geolocation/checkGeolocPermission.ios'

import { GeolocPermissionState } from './enums'

jest.mock('libs/geolocation/checkGeolocPermission', () =>
  jest.requireActual('./checkGeolocPermission')
)

type PermissionValue = 'unavailable' | 'blocked' | 'denied' | 'granted' | 'limited'
jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  PERMISSIONS: { IOS: { LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE' } },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    BLOCKED: 'blocked',
    DENIED: 'denied',
    GRANTED: 'granted',
    LIMITED: 'limited',
  },
}))
const mockCheck = jest.mocked(check)

describe('checkGeolocPermission()', () => {
  Platform.OS = 'ios'

  it.each`
    permissionResult       | expectedState
    ${RESULTS.GRANTED}     | ${GeolocPermissionState.GRANTED}
    ${RESULTS.DENIED}      | ${GeolocPermissionState.DENIED}
    ${RESULTS.BLOCKED}     | ${GeolocPermissionState.NEVER_ASK_AGAIN}
    ${RESULTS.UNAVAILABLE} | ${GeolocPermissionState.NEVER_ASK_AGAIN}
    ${RESULTS.LIMITED}     | ${GeolocPermissionState.NEVER_ASK_AGAIN}
  `(
    'should return $expectedState when permissionResult=$permissionResult',
    async ({
      permissionResult,
      expectedState,
    }: {
      permissionResult: PermissionValue
      expectedState: GeolocPermissionState
    }) => {
      mockCheck.mockResolvedValue(permissionResult as PermissionValue)
      const permission = await checkGeolocPermission()
      expect(permission).toEqual(expectedState)
    }
  )
})
