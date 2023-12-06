import { GeoPosition } from 'react-native-geolocation-service'

import { act } from 'tests/utils'

export const EiffelTourCoordinates = {
  latitude: 48.85,
  longitude: 2.29,
}

export const getCurrentPositionSuccess = (onSuccess: (position: GeoPosition) => void): void =>
  process.nextTick(() => {
    act(() => {
      onSuccess({
        coords: EiffelTourCoordinates,
      } as GeoPosition)
    })
  })
