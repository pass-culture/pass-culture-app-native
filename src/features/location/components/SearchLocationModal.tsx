import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { getLocationSubmit } from 'features/location/helpers/getLocationSubmit'
import { createSelectLocationMode } from 'features/location/helpers/selectLocationMode'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationMode } from 'libs/location/types'
import { useLocation } from 'libs/location/useLocation'
import {
  locationModalActions,
  useLocationModal,
  useLocationModalConfiguration,
} from 'libs/locationV2/locationModal.store'

export const SearchLocationModal = () => {
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
  } = useLocation()

  const { locationMode, visible } = useLocationModal()
  const { radius: tempAroundMeRadius } = useLocationModalConfiguration(LocationMode.AROUND_ME)
  const { radius: tempAroundPlaceRadius } = useLocationModalConfiguration(LocationMode.AROUND_PLACE)
  const {
    setAroundMeRadius: setTempAroundMeRadius,
    setAroundPlaceRadius: setTempAroundPlaceRadius,
  } = locationModalActions

  const dismissModal = locationModalActions.hide

  const { onSubmit, onClose } = getLocationSubmit({
    dismissModal,
    from: 'search',
    dispatch,
    tempLocationMode: locationMode,
    setSelectedLocationMode,
    setPlace,
    tempAroundPlaceRadius,
    tempAroundMeRadius,
    selectedPlace,
    setAroundPlaceRadius,
    setTempAroundMeRadius: locationModalActions.setAroundMeRadius,
    setAroundMeRadius,
    setTempAroundPlaceRadius: locationModalActions.setAroundPlaceRadius,
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

  const selectLocationMode = createSelectLocationMode({
    onSubmit,
  })

  return (
    <LocationModal
      visible={visible}
      onSubmit={onSubmit}
      hasGeolocPosition={hasGeolocPosition}
      tempLocationMode={locationMode}
      onClose={onClose}
      selectLocationMode={selectLocationMode}
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
      isSubmitDisabled={!selectedPlace && locationMode !== LocationMode.AROUND_ME}
      shouldDisplayEverywhereSection
    />
  )
}
