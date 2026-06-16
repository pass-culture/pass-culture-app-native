import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { GeolocationError } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'

export const syncLocation = async () => {
  const permission = locationSelectors.selectPermissionState()
  if (permission === GeolocPermissionState.GRANTED) {
    try {
      const newPosition = await getGeolocPosition()
      locationActions.setGeolocPosition(newPosition)
      locationActions.setGeolocationError(null)
    } catch (e) {
      const newPositionError = e as { cause: GeolocationError } | null
      locationActions.setGeolocPosition(null)
      locationActions.setGeolocationError(newPositionError?.cause ?? null)
    }
  }
}
