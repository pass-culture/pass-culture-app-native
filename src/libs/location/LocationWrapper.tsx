import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'

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
import { SuggestedPlace } from 'libs/place/types'

import { GeolocationActivationModal } from './geolocation/components/GeolocationActivationModal'

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
  const {
    permissionState,
    geolocationError: geolocPositionError,
    isPermissionModalVisible: isGeolocPermissionModalVisible,
  } = useLocationV2()
  const { geolocation: geolocPosition } = useLocationConfiguration(LocationMode.AROUND_ME)
  const {
    showPermissionModal: showGeolocPermissionModal,
    hidePermissionModal: hideGeolocPermissionModal,
  } = locationActions

  // app state
  const { radius: aroundPlaceRadius } = useLocationConfiguration(LocationMode.AROUND_PLACE)
  const place = usePlace()
  const { setPlace, setAroundPlaceRadius, setAroundMeRadius } = locationActions

  const { radius: aroundMeRadius } = useLocationConfiguration(LocationMode.AROUND_ME)

  // modal state
  const [placeQuery, setPlaceQuery] = useState('') // search input value
  const [selectedPlace, setSelectedPlace] = useState<SuggestedPlace | null>(null) // selected suggested place

  const onResetPlace = useCallback(() => {
    setSelectedPlace(null)
    setPlaceQuery('')
  }, [])

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
      geolocPosition,
      geolocPositionError,
      permissionState,
      hasGeolocPosition,
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
    ]
  )
  return (
    <LocationContext.Provider value={value}>
      {children}
      <GeolocationActivationModal
        isGeolocPermissionModalVisible={isGeolocPermissionModalVisible}
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
    </LocationContext.Provider>
  )
})

export function useLocation(): ILocationContext {
  return useContext(LocationContext)
}
