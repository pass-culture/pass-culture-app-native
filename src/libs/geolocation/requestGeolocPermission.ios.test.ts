import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { GeolocPermissionState } from './enums'
import { requestGeolocPermission } from './requestGeolocPermission.ios'

jest.mock('libs/geolocation/requestGeolocPermission', () =>
  jest.requireActual('./requestGeolocPermission')
)

describe('requestGeolocPermission ios', () => {
  beforeAll(() => (Platform.OS = 'ios'))

  it('should ask for ios permission and return GRANTED if granted', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('granted')

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.GRANTED)
  })
  it('should return NEVER_ASK_AGAIN else', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('restricted')

    const permissionState = await requestGeolocPermission()

    expect(permissionState).toEqual(GeolocPermissionState.NEVER_ASK_AGAIN)
  })
})
