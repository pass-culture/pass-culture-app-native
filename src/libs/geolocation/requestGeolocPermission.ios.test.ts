import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { GeolocPermissionState } from './permissionState.d'
import { requestGeolocPermission } from './requestGeolocPermission.ios'

describe('requestGeolocPermission ios', () => {
  beforeAll(() => (Platform.OS = 'ios'))
  afterEach(() => jest.clearAllMocks())
  it('should ask for ios permission and return GRANTED if granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('granted')

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.GRANTED)
  })
  it('should return NEVER_ASK_AGAIN else', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('restricted')

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })
})
