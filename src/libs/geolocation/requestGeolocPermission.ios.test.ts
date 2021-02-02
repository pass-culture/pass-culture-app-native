import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { flushAllPromises } from 'tests/utils'

import { requestGeolocPermission } from './requestGeolocPermission.ios'

const mockSetPermissionGranted = jest.fn()

describe('requestGeolocPermission ios', () => {
  beforeAll(() => (Platform.OS = 'ios'))
  afterEach(() => jest.clearAllMocks())
  it('should ask for ios permission and return true if granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('granted')

    requestGeolocPermission(mockSetPermissionGranted)

    expect(Geolocation.requestAuthorization).toHaveBeenCalledWith('whenInUse')
    expect(mockSetPermissionGranted).not.toHaveBeenCalled()

    await flushAllPromises()
    expect(mockSetPermissionGranted).toHaveBeenCalledWith(true)
  })
  it('should return false if permission not granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('denied')

    requestGeolocPermission(mockSetPermissionGranted)

    expect(mockSetPermissionGranted).not.toHaveBeenCalled()
    await flushAllPromises()
    expect(mockSetPermissionGranted).not.toHaveBeenCalled()
  })
})
