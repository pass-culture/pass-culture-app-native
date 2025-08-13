/* eslint-disable local-rules/independent-mocks */
import { Platform } from 'react-native'
import * as RNPermissions from 'react-native-permissions'

import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission.android'

const permissionsCheckSpy = jest.spyOn(RNPermissions, 'check')

describe('checkGeolocPermission()', () => {
  Platform.OS = 'android'

  it('should return granted when COARSE_LOCATION permission is granted', async () => {
    permissionsCheckSpy.mockResolvedValueOnce('granted')
    const permission = await checkGeolocPermission()

    expect(permission).toEqual('granted')
  })

  it('should return never_ask_again when COARSE_LOCATION permission is denied', async () => {
    permissionsCheckSpy.mockResolvedValueOnce('denied')
    const permission = await checkGeolocPermission()

    expect(permission).toEqual('never_ask_again')
  })

  it('should return never_ask_again when COARSE_LOCATION permission is blocked', async () => {
    permissionsCheckSpy.mockResolvedValueOnce('blocked')
    const permission = await checkGeolocPermission()

    expect(permission).toEqual('never_ask_again')
  })

  it('should return never_ask_again when COARSE_LOCATION permission is unavailable', async () => {
    permissionsCheckSpy.mockResolvedValueOnce('unavailable')
    const permission = await checkGeolocPermission()

    expect(permission).toEqual('never_ask_again')
  })
})
