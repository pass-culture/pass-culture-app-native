import Geolocation, {
  GeolocationResponse,
  GeolocationError,
} from '@react-native-community/geolocation'
import { renderHook, act } from '@testing-library/react-hooks'
import { Alert } from 'react-native'

import { useGeolocation } from './useGeolocation'

const EiffelTourCoordinates = {
  latitude: 48.85,
  longitude: 2.29,
  altitude: 100,
}

const getCurrentPositionFail = (
  _onSuccess: (position: GeolocationResponse) => void,
  onError?: (error: GeolocationError) => void
) =>
  process.nextTick(() => {
    act(() => {
      onError?.({
        code: 1,
        message: 'Timeout error',
      } as GeolocationError)
    })
  })

const getCurrentPositionSuccess = (onSuccess: (position: GeolocationResponse) => void) =>
  process.nextTick(() => {
    act(() => {
      onSuccess({
        coords: EiffelTourCoordinates,
      } as GeolocationResponse)
    })
  })

describe('useGeolocation', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should call getCurrentPosition', async () => {
    const getCurrentPosition = jest
      .spyOn(Geolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionSuccess)

    renderHook(() => useGeolocation())

    expect(getCurrentPosition).toHaveBeenCalled()
  })

  it('should resolve with the geolocation', async () => {
    jest.spyOn(Geolocation, 'getCurrentPosition').mockImplementation(getCurrentPositionSuccess)

    const { result, waitForNextUpdate } = renderHook(() => useGeolocation())

    await waitForNextUpdate()

    expect(result.current).toEqual(EiffelTourCoordinates)
  })

  it('should reject with empty coordinates', async () => {
    jest.spyOn(Geolocation, 'getCurrentPosition').mockImplementation(getCurrentPositionFail)
    const alert = jest.spyOn(Alert, 'alert')

    const { result, waitFor } = renderHook(() => useGeolocation())

    await waitFor(
      () => {
        expect(alert).toBeCalled()
      },
      {
        interval: 1000,
        timeout: 3000,
      }
    )
    expect(result.current).toEqual({})
  })
})
