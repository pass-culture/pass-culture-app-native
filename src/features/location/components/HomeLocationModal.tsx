import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useLocationState } from 'features/location/helpers/useLocationState'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location/LocationWrapper'
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

  const { visible } = useLocationModal()
  const { submit, hide: dismissModal } = locationModalActions

  const onSubmit = () => {
    submit()
    analytics.logUserSetLocation('home')
  }

  const { tempLocationMode, setTempLocationMode } = useLocationState()

  const { selectLocationMode } = useLocationMode({
    dismissModal,
    shouldDirectlyValidate: true,
    hasGeolocPosition,
    permissionState,
    setTempLocationMode,
    setSelectedLocationMode,
    setPlace,
    showGeolocPermissionModal,
    requestGeolocPermission,
    tempLocationMode,
    onSubmit,
  })

  return (
    <LocationModal
      visible={visible}
      onSubmit={onSubmit}
      hasGeolocPosition={hasGeolocPosition}
      tempLocationMode={tempLocationMode}
      onClose={dismissModal}
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
