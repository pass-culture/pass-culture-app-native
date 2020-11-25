import { renderHook } from '@testing-library/react-hooks'
import { PermissionsAndroid } from 'react-native'

import { useRequestGeolocPermission } from './useRequestGeolocPermission.android'

jest.spyOn(PermissionsAndroid, 'requestMultiple')

describe('useRequestGeolocPermission android', () => {
  afterEach(() => jest.clearAllMocks())
  it('should ask for android permission', () => {
    renderHook(useRequestGeolocPermission)
    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
  })
})
