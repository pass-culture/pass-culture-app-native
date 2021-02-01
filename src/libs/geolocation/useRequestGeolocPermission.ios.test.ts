import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { flushAllPromises } from 'tests/utils'

import { useRequestGeolocPermission } from './useRequestGeolocPermission.ios'

const mockSetPermissionGranted = jest.fn()

describe('useRequestGeolocPermission ios', () => {
  beforeAll(() => (Platform.OS = 'ios'))
  afterEach(() => jest.clearAllMocks())
  it('should ask for ios permission and return true if granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('granted')

    const { requestPermissionRoutine } = useRequestGeolocPermission(mockSetPermissionGranted)
    requestPermissionRoutine()

    expect(Geolocation.requestAuthorization).toHaveBeenCalledWith('whenInUse')
    expect(mockSetPermissionGranted).not.toHaveBeenCalled()

    await flushAllPromises()
    expect(mockSetPermissionGranted).toHaveBeenCalledWith(true)
  })
  it('should return false if permission not granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('denied')
    const { requestPermissionRoutine } = useRequestGeolocPermission(mockSetPermissionGranted)
    requestPermissionRoutine()

    expect(mockSetPermissionGranted).not.toHaveBeenCalled()
    await flushAllPromises()
    expect(mockSetPermissionGranted).not.toHaveBeenCalled()
  })
})
