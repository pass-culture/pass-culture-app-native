import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { DEFAULT_RADIUS } from 'features/search/constants'
import { analytics } from 'libs/analytics/provider'
import { useGeolocation } from 'libs/location/geolocation/hook/useGeolocation'
import { LocationMode, ILocationContext, Position } from 'libs/location/types'
import { locationActions, useLocationV2 } from 'libs/locationV2/location.store'
import { SuggestedPlace } from 'libs/place/types'
import { storage } from 'libs/storage'

import { GeolocationActivationModal } from './geolocation/components/GeolocationActivationModal'

/* eslint-disable @typescript-eslint/no-empty-function */
const LocationContext = React.createContext<ILocationContext>({
  hasGeolocPosition: false,
  place: null,
  setPlace: () => {},
  onModalHideRef: { current: undefined },
  geolocPosition: undefined,
  geolocPositionError: null,
  permissionState: undefined,
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

  const {
    geolocPosition,
    geolocPositionError,
    permissionState,
    hasGeolocPosition,
    triggerPositionUpdate,
    onPressGeolocPermissionModalButton,
    isGeolocPermissionModalVisible,
    showGeolocPermissionModal,
    hideGeolocPermissionModal,
    contextualRequestGeolocPermission,
  } = useGeolocation()

  const onModalHideRef = useRef<() => void>(() => null)

  // app state
  const { place, radius: aroundPlaceRadius } = useLocationV2().configuration.AROUND_PLACE
  const { setAroundPlacePlace: setPlace, setAroundPlaceRadius } = locationActions

  const { radius: aroundMeRadius } = useLocationV2().configuration.AROUND_ME
  const { setAroundMeRadius } = locationActions

  // modal state
  const [placeQuery, setPlaceQuery] = useState('') // search input value
  const [selectedPlace, setSelectedPlace] = useState<SuggestedPlace | null>(null) // selected suggested place

  const onResetPlace = useCallback(() => {
    setSelectedPlace(null)
    setPlaceQuery('')
  }, [])

  useEffect(() => {
    switch (true) {
      case !!place:
        storage.saveString('location_type', 'UserSpecificLocation')
        break
      case hasGeolocPosition:
        storage.saveString('location_type', 'UserGeolocation')
        break
      default:
        storage.clear('location_type')
        break
    }
    analytics.setEventLocationType()
  }, [hasGeolocPosition, place])

  let userLocation: Position
  switch (true) {
    case selectedLocationMode === LocationMode.AROUND_PLACE:
      userLocation = place?.geolocation
      break
    case selectedLocationMode === LocationMode.AROUND_ME:
      userLocation = geolocPosition
      break
    case selectedLocationMode === LocationMode.EVERYWHERE:
      userLocation = undefined
      break
    default:
      userLocation = geolocPosition
      break
  }

  const value = useMemo(
    () => ({
      geolocPosition,
      geolocPositionError,
      permissionState,
      hasGeolocPosition,
      onModalHideRef,
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
      contextualRequestGeolocPermission,
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
