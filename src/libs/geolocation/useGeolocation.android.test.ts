import { renderHook } from '@testing-library/react-hooks'
import { Alert, Platform, PermissionsAndroid } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { getAllowedPermissions } from 'tests/permissions-android'

import {
  EiffelTourCoordinates,
  getCurrentPositionFail,
  getCurrentPositionSuccess,
} from './tests.utils'
import { useGeolocation } from './useGeolocation.android'

const getPermissionsAndroidFail = () =>
  jest
    .spyOn(PermissionsAndroid, 'requestMultiple')
    .mockImplementation(() => Promise.reject('Not allowed'))

const getPermissionsAndroidSuccess = () =>
  jest
    .spyOn(PermissionsAndroid, 'requestMultiple')
    .mockImplementation(() =>
      Promise.resolve(
        getAllowedPermissions([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ])
      )
    )

describe('useGeolocation Android', () => {
  beforeAll(() => (Platform.OS = 'android'))
  afterEach(() => jest.resetAllMocks())

  it('should resolve with the geolocation when permission request is accepted', async () => {
    getPermissionsAndroidSuccess()

    const getCurrentPosition = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionSuccess)

    const { result, waitForNextUpdate } = renderHook(() => useGeolocation())

    await waitForNextUpdate()

    expect(getCurrentPosition).toHaveBeenCalled()
    expect(result.current).toEqual(EiffelTourCoordinates)
  })
  it('should reject with empty coordinates when permission request is rejected', async () => {
    getPermissionsAndroidFail()

    const getCurrentPosition = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionFail)
    const alert = jest.spyOn(Alert, 'alert')

    const { result, waitFor } = renderHook(() => useGeolocation())

    await waitFor(() => expect(alert).toBeCalled(), {
      interval: 1000,
      timeout: 3000,
    })
    expect(getCurrentPosition).not.toHaveBeenCalled()
    expect(result.current).toEqual(null)
  })
})
