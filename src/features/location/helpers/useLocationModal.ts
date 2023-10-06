import { useCallback, useEffect, useState } from 'react'

import { LocationMode } from 'features/location/enums'
import { useCustomLocationModeColor } from 'features/location/helpers/useCustomLocationModeColor'
import { useGeolocationModeColor } from 'features/location/helpers/useGeolocationModeColor'
import { useLocation } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'

export const useLocationModal = (visible: boolean) => {
  const {
    isGeolocated,
    isCustomPosition,
    place,
    setPlace: setPlaceGlobally,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useLocation()

  const [placeQuery, setPlaceQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<SuggestedPlace | null>(null)
  const defaultLocationMode = isGeolocated ? LocationMode.GEOLOCATION : LocationMode.NONE

  const [selectedLocationMode, setSelectedLocationMode] =
    useState<LocationMode>(defaultLocationMode)

  const geolocationModeColor = useGeolocationModeColor(selectedLocationMode)
  const customLocationModeColor = useCustomLocationModeColor(selectedLocationMode)

  const onSetSelectedPlace = (place: SuggestedPlace) => {
    setSelectedPlace(place)
    setPlaceQuery(place.label)
  }

  const onResetPlace = () => {
    setSelectedPlace(null)
    setPlaceQuery('')
  }

  const initializeLocationMode = useCallback(() => {
    onModalHideRef.current = undefined
    if (isCustomPosition) {
      setSelectedLocationMode(LocationMode.CUSTOM_POSITION)
    } else {
      setSelectedLocationMode(defaultLocationMode)
    }
  }, [onModalHideRef, isCustomPosition, setSelectedLocationMode, defaultLocationMode])

  useEffect(() => {
    if (visible) {
      initializeLocationMode()
      if (place) {
        onSetSelectedPlace(place)
      } else {
        onResetPlace()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initializeLocationMode])

  return {
    isGeolocated,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    selectedLocationMode,
    setSelectedLocationMode,
    geolocationModeColor,
    customLocationModeColor,
    onSetSelectedPlace,
    onResetPlace,
    setPlaceGlobally,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  }
}
