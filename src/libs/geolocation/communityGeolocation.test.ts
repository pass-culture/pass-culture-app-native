import CommunityGeolocation, {
  GeolocationResponse,
  GeolocationError,
} from '@react-native-community/geolocation'
import { renderHook, act } from '@testing-library/react-hooks'
import { Alert } from 'react-native'

import { useGeolocation } from './communityGeolocation'

const EiffelTourCoordinates = {
  latitude: 48.85,
  longitude: 2.29,
  altitude: 100,
}

const getCurrentPositionFunction = (shouldFail: boolean) => (
  onSuccess: (position: GeolocationResponse) => void,
  onError?: (error: GeolocationError) => void
) =>
  process.nextTick(() => {
    act(() => {
      if (shouldFail) {
        onError?.({
          code: 1,
          message: 'Timeout error',
        } as GeolocationError)
      } else {
        onSuccess({
          coords: EiffelTourCoordinates,
        } as GeolocationResponse)
      }
    })
  })

describe('useCommunityGeolocation', () => {
  it('should call getCurrentPosition', async () => {
    const getCurrentPosition = jest
      .spyOn(CommunityGeolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionFunction(false))

    renderHook(() => useGeolocation())

    expect(getCurrentPosition).toHaveBeenCalled()
    getCurrentPosition.mockRestore()
  })
  it('should resolve with the geolocation', async () => {
    const getCurrentPosition = jest
      .spyOn(CommunityGeolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionFunction(false))

    const { result, waitForNextUpdate } = renderHook(() => useGeolocation())

    await waitForNextUpdate()

    expect(result.current).toEqual(EiffelTourCoordinates)
    getCurrentPosition.mockRestore()
  })
  it('should reject with empty coordinates', async () => {
    const getCurrentPosition = jest
      .spyOn(CommunityGeolocation, 'getCurrentPosition')
      .mockImplementation(getCurrentPositionFunction(true))
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

    alert.mockRestore()
    getCurrentPosition.mockRestore()
  })
})
