/* eslint-disable local-rules/independent-mocks */
import { Platform } from 'react-native'
import * as RNPermissions from 'react-native-permissions'

import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission.android'
import { GeolocPermissionState } from 'libs/location/location'

const permissionsCheckSpy = jest.spyOn(RNPermissions, 'check')

describe('checkGeolocPermission()', () => {
  Platform.OS = 'android'

  it('should return granted when COARSE_LOCATION permission is granted', async () => {
    permissionsCheckSpy.mockResolvedValueOnce('granted')
    const permission = await checkGeolocPermission()

    expect(permission).toEqual(GeolocPermissionState.GRANTED)
  })

  it.each(['denied', 'blocked', 'unavailable'] as const)(
    'should return never_ask_again when COARSE_LOCATION permission is %s',
    async (status) => {
      permissionsCheckSpy.mockResolvedValueOnce(status)
      const permission = await checkGeolocPermission()

      expect(permission).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
    }
  )
})
