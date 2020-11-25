import { renderHook } from '@testing-library/react-hooks'
import Geolocation from 'react-native-geolocation-service'

import { useRequestGeolocPermission } from './useRequestGeolocPermission.ios'

jest.spyOn(Geolocation, 'requestAuthorization')

describe('useRequestGeolocPermission android', () => {
  afterEach(() => jest.clearAllMocks())
  it('should ask for android permission', () => {
    renderHook(useRequestGeolocPermission)
    expect(Geolocation.requestAuthorization).toHaveBeenCalledWith('whenInUse')
  })
})
