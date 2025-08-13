import { PermissionsAndroid, Platform } from 'react-native'

import { GeolocPermissionState } from '../enums'

import { requestGeolocPermission } from './requestGeolocPermission.android'

const requestSpy = jest.spyOn(PermissionsAndroid, 'request')

describe('requestGeolocPermission android', () => {
  beforeAll(() => (Platform.OS = 'android'))

  it('should ask for android permission and return right state if granted', async () => {
    requestSpy.mockResolvedValueOnce(PermissionsAndroid.RESULTS.GRANTED)

    const permissionState = await requestGeolocPermission()

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    )
    expect(permissionState).toEqual(GeolocPermissionState.GRANTED)
  })

  it('should return right state if permission not granted', async () => {
    requestSpy.mockResolvedValueOnce(PermissionsAndroid.RESULTS.DENIED)

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.DENIED)
  })

  it('should return right state if permission not granted and ask for never_ask_again', async () => {
    requestSpy.mockResolvedValueOnce(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })
})
