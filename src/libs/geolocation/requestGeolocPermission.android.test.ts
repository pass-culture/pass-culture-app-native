import { Permission, PermissionsAndroid, PermissionStatus, Platform } from 'react-native'

import { requestGeolocPermission } from './requestGeolocPermission.android'

describe('requestGeolocPermission android', () => {
  beforeAll(() => (Platform.OS = 'android'))
  afterEach(() => jest.clearAllMocks())
  it('should ask for android permission and return true if granted', async () => {
    jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
      'android.permission.ACCESS_FINE_LOCATION': 'granted',
      'android.permission.ACCESS_COARSE_LOCATION': 'granted',
    } as { [key in Permission]: PermissionStatus })

    const isPermissionGranted = await requestGeolocPermission()

    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
    expect(isPermissionGranted).toBeTruthy()
  })

  it('should return false if permission not granted', async () => {
    jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
      'android.permission.ACCESS_FINE_LOCATION': 'denied',
      'android.permission.ACCESS_COARSE_LOCATION': 'denied',
    } as { [key in Permission]: PermissionStatus })

    const isPermissionGranted = await requestGeolocPermission()

    expect(isPermissionGranted).toBeFalsy()
  })
})
