import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location/useLocation'
import { locationModalActions, useLocationModal } from 'libs/locationV2/locationModal.store'

export const HomeLocationModal = () => {
  const {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    setPlace,
    onResetPlace,
    setSelectedLocationMode,
    permissionState,
    showGeolocPermissionModal,
    requestGeolocPermission,
  } = useLocation()

  const { visible, locationMode } = useLocationModal()

  const onSubmit = () => {
    locationModalActions.submit()
    void analytics.logUserSetLocation('home')
  }

  const { selectLocationMode } = useLocationMode({
    dismissModal: locationModalActions.hide,
    shouldDirectlyValidate: true,
    hasGeolocPosition,
    permissionState,
    setTempLocationMode: locationModalActions.setLocationMode,
    setSelectedLocationMode,
    setPlace,
    showGeolocPermissionModal,
    requestGeolocPermission,
    tempLocationMode: locationMode,
    onSubmit,
  })

  return (
    <LocationModal
      visible={visible}
      onSubmit={onSubmit}
      hasGeolocPosition={hasGeolocPosition}
      tempLocationMode={locationMode}
      onClose={locationModalActions.hide}
      selectLocationMode={selectLocationMode}
      selectedPlace={selectedPlace}
      setSelectedPlace={setSelectedPlace}
      placeQuery={placeQuery}
      setPlaceQuery={setPlaceQuery}
      onResetPlace={onResetPlace}
      shouldShowRadiusSlider={false}
      isSubmitDisabled={!selectedPlace}
      shouldDisplayEverywhereSection
    />
  )
}
