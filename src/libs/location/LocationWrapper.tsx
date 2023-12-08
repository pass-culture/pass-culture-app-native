import React, { memo, useContext, useEffect, useMemo, useRef } from 'react'

import { DEFAULT_RADIUS } from 'features/search/constants'
import { analytics } from 'libs/analytics'
import { useSafeState } from 'libs/hooks'
import { useGeolocation } from 'libs/location/geolocation/hook/useGeolocation'
import { useAroundRadius } from 'libs/location/hooks/useAroundRadius'
import { useLocationMode } from 'libs/location/hooks/useLocationMode'
import { usePlace } from 'libs/location/hooks/usePlace'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place'
import { storage } from 'libs/storage'

import { GeolocationActivationModal } from './geolocation/components/GeolocationActivationModal'
import { ILocationContext } from './types'

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
  tempLocationMode: LocationMode.EVERYWHERE,
  setTempLocationMode: () => null,
  isCurrentLocationMode: () => false,
  onResetPlace: () => null,
  onSetSelectedPlace: () => null,
  selectedPlace: null,
  setSelectedPlace: () => null,
  placeQuery: '',
  setPlaceQuery: () => null,
  aroundPlaceRadius: DEFAULT_RADIUS,
  setAroundPlaceRadius: () => null,
  aroundMeRadius: DEFAULT_RADIUS,
  setAroundMeRadius: () => null,
})
/* eslint-enable @typescript-eslint/no-empty-function */

export const LocationWrapper = memo(function LocationWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const [place, setPlace] = useSafeState<SuggestedPlace | null>(null)
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

  const onModalHideRef = useRef<() => void>()
  const { tempLocationMode, setTempLocationMode, isCurrentLocationMode } = useLocationMode({
    hasGeolocPosition,
  })
  const {
    onResetPlace,
    onSetSelectedPlace,
    selectedPlace,
    setSelectedPlace,
    placeQuery,
    setPlaceQuery,
  } = usePlace()
  const { aroundPlaceRadius, setAroundPlaceRadius, aroundMeRadius, setAroundMeRadius } =
    useAroundRadius()

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
      tempLocationMode,
      setTempLocationMode,
      isCurrentLocationMode,
      onResetPlace,
      onSetSelectedPlace,
      selectedPlace,
      setSelectedPlace,
      placeQuery,
      setPlaceQuery,
      aroundPlaceRadius,
      setAroundPlaceRadius,
      aroundMeRadius,
      setAroundMeRadius,
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
      tempLocationMode,
      setTempLocationMode,
      isCurrentLocationMode,
      onResetPlace,
      onSetSelectedPlace,
      selectedPlace,
      setSelectedPlace,
      placeQuery,
      setPlaceQuery,
      aroundPlaceRadius,
      setAroundPlaceRadius,
      aroundMeRadius,
      setAroundMeRadius,
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
