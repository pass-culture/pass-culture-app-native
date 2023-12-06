import React, { memo, useContext, useEffect, useMemo, useRef } from 'react'

import { analytics } from 'libs/analytics'
import { useSafeState } from 'libs/hooks'
import { useGeolocation } from 'libs/location/geolocation/hook/useGeolocation'
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
