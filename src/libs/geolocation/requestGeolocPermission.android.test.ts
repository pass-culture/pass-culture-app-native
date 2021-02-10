import { Permission, PermissionsAndroid, PermissionStatus, Platform } from 'react-native'

import { GeolocPermissionState } from './permissionState.d'
import { requestGeolocPermission } from './requestGeolocPermission.android'

describe('requestGeolocPermission android', () => {
  beforeAll(() => (Platform.OS = 'android'))
  afterEach(() => jest.clearAllMocks())
  it('should ask for android permission and return right state if granted', async () => {
    jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
      'android.permission.ACCESS_FINE_LOCATION': 'granted',
      'android.permission.ACCESS_COARSE_LOCATION': 'granted',
    } as { [key in Permission]: PermissionStatus })

    const permissionState = await requestGeolocPermission()

    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
    expect(permissionState).toEqual(GeolocPermissionState.GRANTED)
  })

  it('should return right state if permission not granted', async () => {
    jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
      'android.permission.ACCESS_FINE_LOCATION': 'denied',
      'android.permission.ACCESS_COARSE_LOCATION': 'denied',
    } as { [key in Permission]: PermissionStatus })

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.DENIED)
  })

  it('should return right state if permission not granted and ask for never_ask_again', async () => {
    jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
      'android.permission.ACCESS_FINE_LOCATION': 'never_ask_again',
      'android.permission.ACCESS_COARSE_LOCATION': 'never_ask_again',
    } as { [key in Permission]: PermissionStatus })

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })
})
