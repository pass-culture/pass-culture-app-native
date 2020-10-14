import { renderHook } from '@testing-library/react-hooks'
import { Alert, Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import AgonTukGeolocation from 'react-native-geolocation-service'

import {
  EiffelTourCoordinates,
  getCurrentPositionFail,
  getCurrentPositionSuccess,
} from './tests.utils'
import { useGeolocation } from './useGeolocation.ios'

const getPermissionsIOSFail = () =>
  jest
    .spyOn(AgonTukGeolocation, 'requestAuthorization')
    .mockImplementation(() => Promise.reject('denied'))

const getPermissionsIOSSuccess = () =>
  jest
    .spyOn(AgonTukGeolocation, 'requestAuthorization')
    .mockImplementation(() => Promise.resolve('granted'))

describe('useGeolocation iOS', () => {
  beforeAll(() => (Platform.OS = 'ios'))
  afterEach(() => jest.resetAllMocks())

  it('should resolve with the geolocation when permission request is accepted', async () => {
    getPermissionsIOSSuccess()

    const getCurrentPosition = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionSuccess)

    const { result, waitForNextUpdate } = renderHook(() => useGeolocation())

    await waitForNextUpdate()

    expect(getCurrentPosition).toHaveBeenCalled()
    expect(result.current).toEqual(EiffelTourCoordinates)
  })
  it('should reject with empty coordinates when permission request is rejected', async () => {
    getPermissionsIOSFail()

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
