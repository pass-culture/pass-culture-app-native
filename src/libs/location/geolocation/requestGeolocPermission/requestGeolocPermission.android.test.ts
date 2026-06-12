import { PermissionsAndroid, Platform } from 'react-native'
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler'

import { GeolocPermissionState } from '../enums'

import { requestGeolocPermission } from './requestGeolocPermission.android'

jest.mock('react-native-android-location-enabler', () => ({
  promptForEnableLocationIfNeeded: jest.fn(),
}))
const mockPromptForEnableLocationIfNeeded = jest.mocked(promptForEnableLocationIfNeeded)

const requestMultipleSpy = jest.spyOn(PermissionsAndroid, 'requestMultiple')

const FINE = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
const COARSE = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION

const mockStatuses = (fineStatus: string, coarseStatus: string) =>
  requestMultipleSpy.mockResolvedValueOnce({
    [FINE]: fineStatus,
    [COARSE]: coarseStatus,
  } as Awaited<ReturnType<typeof PermissionsAndroid.requestMultiple>>)

describe('requestGeolocPermission android', () => {
  beforeAll(() => (Platform.OS = 'android'))

  it('should ask for android fine and coarse permissions and return granted state if fine location is granted', async () => {
    mockStatuses(PermissionsAndroid.RESULTS.GRANTED, PermissionsAndroid.RESULTS.GRANTED)
    mockPromptForEnableLocationIfNeeded.mockResolvedValueOnce('already-enabled')

    const permissionState = await requestGeolocPermission()

    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([FINE, COARSE])
    expect(promptForEnableLocationIfNeeded).toHaveBeenCalledWith()
    expect(permissionState).toEqual(GeolocPermissionState.GRANTED)
  })

  it('should return granted state if user only grants approximate (coarse) location', async () => {
    mockStatuses(PermissionsAndroid.RESULTS.DENIED, PermissionsAndroid.RESULTS.GRANTED)
    mockPromptForEnableLocationIfNeeded.mockResolvedValueOnce('already-enabled')

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.GRANTED)
  })

  it('should return denied state if permission granted but user refuses to enable location', async () => {
    mockStatuses(PermissionsAndroid.RESULTS.GRANTED, PermissionsAndroid.RESULTS.GRANTED)
    mockPromptForEnableLocationIfNeeded.mockRejectedValueOnce(new Error('denied'))

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.DENIED)
  })

  it('should return right state if permission not granted', async () => {
    mockStatuses(PermissionsAndroid.RESULTS.DENIED, PermissionsAndroid.RESULTS.DENIED)

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.DENIED)
  })

  it('should return right state if permission not granted and ask for never_ask_again', async () => {
    mockStatuses(
      PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
      PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    )

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })
})
