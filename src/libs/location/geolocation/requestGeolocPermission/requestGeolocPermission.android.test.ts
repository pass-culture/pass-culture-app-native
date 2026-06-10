import { PermissionsAndroid, Platform } from 'react-native'
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler'

import { GeolocPermissionState } from '../enums'

import { requestGeolocPermission } from './requestGeolocPermission.android'

jest.mock('react-native-android-location-enabler', () => ({
  promptForEnableLocationIfNeeded: jest.fn(),
}))
const mockPromptForEnableLocationIfNeeded = jest.mocked(promptForEnableLocationIfNeeded)

const requestSpy = jest.spyOn(PermissionsAndroid, 'request')

describe('requestGeolocPermission android', () => {
  beforeAll(() => (Platform.OS = 'android'))

  it('should ask for android permission and return right state if granted', async () => {
    requestSpy.mockResolvedValueOnce(PermissionsAndroid.RESULTS.GRANTED)
    mockPromptForEnableLocationIfNeeded.mockResolvedValueOnce('already-enabled')

    const permissionState = await requestGeolocPermission()

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    )
    expect(promptForEnableLocationIfNeeded).toHaveBeenCalledWith()
    expect(permissionState).toEqual(GeolocPermissionState.GRANTED)
  })

  it('should return denied state if permission granted but user refuses to enable location', async () => {
    requestSpy.mockResolvedValueOnce(PermissionsAndroid.RESULTS.GRANTED)
    mockPromptForEnableLocationIfNeeded.mockRejectedValueOnce(new Error('denied'))

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.DENIED)
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
