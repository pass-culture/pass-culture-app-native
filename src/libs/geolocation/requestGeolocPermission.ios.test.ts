import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { requestGeolocPermission } from './requestGeolocPermission.ios'

describe('requestGeolocPermission ios', () => {
  beforeAll(() => (Platform.OS = 'ios'))
  afterEach(() => jest.clearAllMocks())
  it('should ask for ios permission and return true if granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('granted')

    const isPermissionGranted = await requestGeolocPermission()

    expect(isPermissionGranted).toBeTruthy()
  })
  it('should return false if permission not granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('denied')

    const isPermissionGranted = await requestGeolocPermission()

    expect(isPermissionGranted).toBeFalsy()
  })
})
