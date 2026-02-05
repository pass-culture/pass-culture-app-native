import { useCallback, useEffect, useState } from 'react'

import { useFavoritesState } from 'features/favorites/context/FavoritesWrapper'
import { GeolocPermissionState, useLocation } from 'libs/location/location'

export function useGeolocationSwitch() {
  const {
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
    geolocPositionError,
  } = useLocation()

  const { dispatch: favoritesDispatch } = useFavoritesState()

  const [isGeolocSwitchActive, setIsGeolocSwitchActive] = useState<boolean>(
    permissionState === GeolocPermissionState.GRANTED
  )

  useEffect(() => {
    setIsGeolocSwitchActive(permissionState === GeolocPermissionState.GRANTED)
  }, [permissionState])

  const switchGeolocation = useCallback(async () => {
    if (permissionState === GeolocPermissionState.GRANTED) {
      favoritesDispatch({ type: 'SET_SORT_BY', payload: 'RECENTLY_ADDED' })
      showGeolocPermissionModal()
      return
    }

    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
      return
    }

    await requestGeolocPermission()
  }, [permissionState, favoritesDispatch, showGeolocPermissionModal, requestGeolocPermission])

  return {
    isGeolocSwitchActive,
    switchGeolocation,
    geolocPositionError,
    permissionState,
  }
}
