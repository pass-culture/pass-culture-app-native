import { renderHook } from '@testing-library/react-hooks'
import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { useRequestGeolocPermission } from './useRequestGeolocPermission.ios'

describe('useRequestGeolocPermission ios', () => {
  beforeAll(() => (Platform.OS = 'ios'))
  afterEach(() => jest.clearAllMocks())
  it('should ask for ios permission and return true if granted', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('granted')

    const { result, waitForNextUpdate } = renderHook(useRequestGeolocPermission)

    expect(Geolocation.requestAuthorization).toHaveBeenCalledWith('whenInUse')
    expect(result.current).toBeFalsy()

    await waitForNextUpdate()
    expect(result.current).toBeTruthy()
  })
  it('should return false if permission not granted', () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValue('denied')
    const { result } = renderHook(useRequestGeolocPermission)
    expect(result.current).toBeFalsy()
  })
})
