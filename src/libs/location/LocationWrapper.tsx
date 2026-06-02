import React, { memo, useContext, useEffect, useMemo } from 'react'

import { DEFAULT_RADIUS } from 'features/search/constants'
import { useAppStateChange } from 'libs/appState'
import { LocationMode, ILocationContext } from 'libs/location/types'
import {
  contextualCheckPermission,
  contextualRequestGeolocPermission,
  onPressGeolocPermissionModalButton,
  triggerPositionUpdate,
} from 'libs/locationV2/location.methods'
import {
  locationActions,
  useIsGeolocated,
  useLocationConfiguration,
  useLocationV2,
  usePlace,
  useUserLocation,
} from 'libs/locationV2/location.store'
import {
  locationModalActions,
  useLocationModal,
  useLocationModalPlace,
} from 'libs/locationV2/locationModal.store'

/* eslint-disable @typescript-eslint/no-empty-function */
const LocationContext = React.createContext<ILocationContext>({
  hasGeolocPosition: false,
  place: null,
  setPlace: () => {},
  geolocPosition: undefined,
  geolocPositionError: null,
  permissionState: null,
  requestGeolocPermission: async () => {},
  triggerPositionUpdate: () => null,
  showGeolocPermissionModal: () => null,
  onPressGeolocPermissionModalButton: () => null,
  selectedLocationMode: LocationMode.EVERYWHERE,
  setSelectedLocationMode: () => null,
  onResetPlace: () => null,
  selectedPlace: null,
  setSelectedPlace: () => null,
  placeQuery: '',
  setPlaceQuery: () => null,
  aroundPlaceRadius: DEFAULT_RADIUS,
  setAroundPlaceRadius: () => null,
  aroundMeRadius: DEFAULT_RADIUS,
  setAroundMeRadius: () => null,
  userLocation: undefined,
})
/* eslint-enable @typescript-eslint/no-empty-function */

export const LocationWrapper = memo(function LocationWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const { locationMode: selectedLocationMode } = useLocationV2()
  const setSelectedLocationMode = locationActions.setLocationMode

  const hasGeolocPosition = useIsGeolocated()
  const { permissionState, geolocationError: geolocPositionError } = useLocationV2()
  const { geolocation: geolocPosition, radius: aroundMeRadius } = useLocationConfiguration(
    LocationMode.AROUND_ME
  )

  // app state
  const { radius: aroundPlaceRadius } = useLocationConfiguration(LocationMode.AROUND_PLACE)
  const place = usePlace()
  const {
    setPlace,
    setAroundPlaceRadius,
    setAroundMeRadius,
    showPermissionModal: showGeolocPermissionModal,
  } = locationActions

  // modal state
  const selectedPlace = useLocationModalPlace()
  const { setAddressInputValue: setPlaceQuery, setPlace: setSelectedPlace } = locationModalActions
  const { addressInputValue: placeQuery } = useLocationModal()

  const onResetPlace = () => {
    locationModalActions.setPlace(null)
    locationModalActions.setAddressInputValue('')
  }

  useEffect(() => {
    void contextualCheckPermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useAppStateChange(contextualCheckPermission, undefined, [])

  const userLocation = useUserLocation()

  const value = useMemo(
    () => ({
      geolocPosition,
      geolocPositionError,
      permissionState,
      hasGeolocPosition,
      requestGeolocPermission: contextualRequestGeolocPermission,
      triggerPositionUpdate,
      onPressGeolocPermissionModalButton,
      place,
      setPlace,
      showGeolocPermissionModal,
      selectedLocationMode,
      setSelectedLocationMode,
      onResetPlace,
      selectedPlace,
      setSelectedPlace,
      placeQuery,
      setPlaceQuery,
      aroundPlaceRadius,
      setAroundPlaceRadius,
      aroundMeRadius,
      setAroundMeRadius,
      userLocation,
    }),
    [
      aroundMeRadius,
      aroundPlaceRadius,
      geolocPosition,
      geolocPositionError,
      hasGeolocPosition,
      permissionState,
      place,
      placeQuery,
      selectedLocationMode,
      selectedPlace,
      setAroundMeRadius,
      setAroundPlaceRadius,
      setPlace,
      setPlaceQuery,
      setSelectedLocationMode,
      setSelectedPlace,
      showGeolocPermissionModal,
      userLocation,
    ]
  )
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
})

export function useLocation(): ILocationContext {
  return useContext(LocationContext)
}
