import { renderHook } from '@testing-library/react-hooks'
import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import {
  EiffelTourCoordinates,
  getCurrentPositionFail,
  getCurrentPositionSuccess,
} from './tests.utils'
import { useGeolocation } from './useGeolocation'

describe('useGeolocation Android', () => {
  beforeAll(() => (Platform.OS = 'android'))
  afterEach(() => jest.resetAllMocks())

  it('should resolve with the geolocation when permission request is accepted', async () => {
    const getCurrentPosition = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionSuccess)

    const { result, waitForNextUpdate } = renderHook(() => useGeolocation())

    await waitForNextUpdate()

    expect(getCurrentPosition).toHaveBeenCalled()
    expect(result.current).toEqual(EiffelTourCoordinates)
  })
  it('should reject with empty coordinates when permission request is rejected', async () => {
    const getCurrentPosition = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionFail)

    const { result } = renderHook(() => useGeolocation())

    expect(getCurrentPosition).toHaveBeenCalled()
    expect(result.current).toEqual(null)
  })
})
