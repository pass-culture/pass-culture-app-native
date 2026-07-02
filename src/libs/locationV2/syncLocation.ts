import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { GeolocationError, LocationMode } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { locationModalActions, locationModalSelectors } from 'libs/locationV2/locationModal.store'

import { setAroundPlaceFromCoords } from './setAroundPlaceFromCoords'

export const syncLocation = async () => {
  const permission = locationSelectors.selectPermissionState()
  if (permission === GeolocPermissionState.GRANTED) {
    return updateGeolocPosition()
  }
  if (locationModalSelectors.selectLocationMode() === LocationMode.AROUND_ME) {
    locationModalActions.setLocationMode(LocationMode.EVERYWHERE)
  }
  await switchFromAroundMeToAroundPlace()
}

const updateGeolocPosition = async () => {
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

const switchFromAroundMeToAroundPlace = async () => {
  const locationMode = locationSelectors.selectLocationMode()
  const aroundMeConfig = locationSelectors.selectLocationConfiguration(LocationMode.AROUND_ME)
  if (locationMode === LocationMode.AROUND_ME) {
    if (aroundMeConfig.geolocation) {
      await setAroundPlaceFromCoords(aroundMeConfig.geolocation)
    } else {
      locationActions.setLocationMode(LocationMode.EVERYWHERE)
    }
  }
}
