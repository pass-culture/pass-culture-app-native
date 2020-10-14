import { act } from '@testing-library/react-hooks'
import { GeoPosition, GeoError } from 'react-native-geolocation-service'

export const EiffelTourCoordinates = {
  latitude: 48.85,
  longitude: 2.29,
  altitude: 100,
}

export const getCurrentPositionFail = (
  _onSuccess: (position: GeoPosition) => void,
  onError?: (error: GeoError) => void
): void =>
  process.nextTick(() => {
    act(() => {
      onError?.({
        code: 1,
        message: 'Timeout error',
      } as GeoError)
    })
  })

export const getCurrentPositionSuccess = (onSuccess: (position: GeoPosition) => void): void =>
  process.nextTick(() => {
    act(() => {
      onSuccess({
        coords: EiffelTourCoordinates,
      } as GeoPosition)
    })
  })
