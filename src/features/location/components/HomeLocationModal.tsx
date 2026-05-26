import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useLocationState } from 'features/location/helpers/useLocationState'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location/LocationWrapper'

interface HomeLocationModalProps {
  visible: boolean
  dismissModal: () => void
}

export const HomeLocationModal = ({ visible, dismissModal }: HomeLocationModalProps) => {
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

  const { tempLocationMode, setTempLocationMode } = useLocationState({
    visible,
  })

  const onSubmit = () => {
    setPlace(selectedPlace)
    setSelectedLocationMode(tempLocationMode)
    analytics.logUserSetLocation('home')
    dismissModal()
  }

  const onClose = () => {
    dismissModal()
  }

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
      onClose={onClose}
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
