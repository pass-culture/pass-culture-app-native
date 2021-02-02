import { Permission, PermissionsAndroid, PermissionStatus, Platform } from 'react-native'

import { flushAllPromises } from 'tests/utils'

import { requestGeolocPermissionRoutine } from './requestGeolocPermissionRoutine.android'

const mockSetPermissionGranted = jest.fn()

describe('requestGeolocPermissionRoutine android', () => {
  beforeAll(() => (Platform.OS = 'android'))
  afterEach(() => jest.clearAllMocks())
  it('should ask for android permission and return true if granted', async () => {
    jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
      'android.permission.ACCESS_FINE_LOCATION': 'granted',
      'android.permission.ACCESS_COARSE_LOCATION': 'granted',
    } as { [key in Permission]: PermissionStatus })

    requestGeolocPermissionRoutine(mockSetPermissionGranted)
    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
    expect(mockSetPermissionGranted).not.toHaveBeenCalled()

    await flushAllPromises()
    expect(mockSetPermissionGranted).toHaveBeenCalledWith(true)
  })

  it('should return false if permission not granted', async () => {
    jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
      'android.permission.ACCESS_FINE_LOCATION': 'denied',
      'android.permission.ACCESS_COARSE_LOCATION': 'denied',
    } as { [key in Permission]: PermissionStatus })

    requestGeolocPermissionRoutine(mockSetPermissionGranted)

    expect(mockSetPermissionGranted).not.toHaveBeenCalled()
    await flushAllPromises()
    expect(mockSetPermissionGranted).not.toHaveBeenCalled()
  })
})
