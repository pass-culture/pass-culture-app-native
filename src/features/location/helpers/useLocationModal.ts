import { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'styled-components/native'

import { LocationMode } from 'features/location/enums'
import { useLocation } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'

export const useLocationModal = (visible: boolean) => {
  const theme = useTheme()
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

  const isCurrentLocationMode = (target: LocationMode) => selectedLocationMode === target

  const geolocationModeColor = isCurrentLocationMode(LocationMode.GEOLOCATION)
    ? theme.colors.primary
    : theme.colors.black

  const customLocationModeColor = isCurrentLocationMode(LocationMode.CUSTOM_POSITION)
    ? theme.colors.primary
    : theme.colors.black

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
    isCurrentLocationMode,
  }
}
