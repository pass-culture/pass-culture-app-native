import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { getLocationSubmit } from 'features/location/helpers/getLocationSubmit'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useLocationState } from 'features/location/helpers/useLocationState'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useLocation } from 'libs/location/LocationWrapper'
import { LocationMode } from 'libs/location/types'

interface LocationModalProps {
  visible: boolean
  dismissModal: () => void
}

export const SearchLocationModal = ({ visible, dismissModal }: LocationModalProps) => {
  const { dispatch } = useSearch()

  const {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    onResetPlace,
    setSelectedLocationMode,
    setAroundPlaceRadius,
    setAroundMeRadius,
    aroundMeRadius,
    setPlace,
    aroundPlaceRadius,
    permissionState,
    showGeolocPermissionModal,
    requestGeolocPermission,
    onModalHideRef,
  } = useLocation()

  const {
    tempLocationMode,
    tempAroundPlaceRadius,
    tempAroundMeRadius,
    setTempAroundMeRadius,
    setTempAroundPlaceRadius,
    setTempLocationMode,
  } = useLocationState({
    visible,
  })

  const { onSubmit, onClose } = getLocationSubmit({
    dismissModal,
    from: 'search',
    dispatch,
    tempLocationMode,
    setSelectedLocationMode,
    setPlace,
    tempAroundPlaceRadius,
    tempAroundMeRadius,
    selectedPlace,
    setAroundPlaceRadius,
    setTempAroundMeRadius,
    setAroundMeRadius,
    setTempAroundPlaceRadius,
    aroundMeRadius,
    aroundPlaceRadius,
  })
  const {
    onTempAroundRadiusPlaceValueChange: onTempAroundPlaceRadiusValueChange,
    onTempAroundMeRadiusValueChange,
  } = useRadiusChange({
    visible,
    setTempAroundPlaceRadius,
    setTempAroundMeRadius,
  })

  const { selectLocationMode } = useLocationMode({
    dismissModal,
    setTempLocationMode,
    setSelectedLocationMode,
    permissionState,
    setPlace,
    onModalHideRef,
    showGeolocPermissionModal,
    requestGeolocPermission,
    hasGeolocPosition,
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
      onModalHideRef={onModalHideRef}
      selectedPlace={selectedPlace}
      setSelectedPlace={setSelectedPlace}
      placeQuery={placeQuery}
      setPlaceQuery={setPlaceQuery}
      onResetPlace={onResetPlace}
      shouldShowRadiusSlider
      tempAroundPlaceRadius={tempAroundPlaceRadius}
      onTempAroundMeRadiusValueChange={onTempAroundMeRadiusValueChange}
      onTempAroundPlaceRadiusValueChange={onTempAroundPlaceRadiusValueChange}
      tempAroundMeRadius={tempAroundMeRadius}
      isSubmitDisabled={!selectedPlace && tempLocationMode !== LocationMode.AROUND_ME}
      shouldDisplayEverywhereSection
    />
  )
}
