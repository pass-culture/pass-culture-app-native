import { useState, useEffect } from 'react'

import { LocationState } from 'features/location/types'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'

type Props = {
  visible: boolean
}

export const useLocationState = ({ visible }: Props): LocationState => {
  const {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    onSetSelectedPlace,
    onResetPlace,
    setPlace,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    aroundPlaceRadius,
    setAroundPlaceRadius,
    aroundMeRadius,
    setAroundMeRadius,
    selectedLocationMode,
    setSelectedLocationMode,
    place,
    showGeolocPermissionModal,
  } = useLocation()

  const [tempAroundMeRadius, setTempAroundMeRadius] = useState<number>(DEFAULT_RADIUS)
  const [tempAroundPlaceRadius, setTempAroundPlaceRadius] = useState<number>(DEFAULT_RADIUS)
  const [tempLocationMode, setTempLocationMode] = useState<LocationMode>(selectedLocationMode)

  useEffect(() => {
    if (visible) {
      setTempLocationMode(selectedLocationMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocationMode, visible])

  useEffect(() => {
    if (visible) {
      onModalHideRef.current = undefined
      setPlaceQuery(place?.label ?? '')
      setSelectedPlace(place)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    onSetSelectedPlace,
    onResetPlace,
    setPlaceGlobally: setPlace,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    aroundPlaceRadius,
    setAroundPlaceRadius,
    aroundMeRadius,
    setAroundMeRadius,
    selectedLocationMode,
    setSelectedLocationMode,
    place,
    tempAroundMeRadius,
    setTempAroundMeRadius,
    tempAroundPlaceRadius,
    setTempAroundPlaceRadius,
    tempLocationMode,
    setTempLocationMode,
    showGeolocPermissionModal,
  }
}
