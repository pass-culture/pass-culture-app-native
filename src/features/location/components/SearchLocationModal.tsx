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
  useCanSubmitLocationModal,
  useLocationModal,
  useLocationModalAddressInputValue,
  useLocationModalConfiguration,
  useLocationModalPlace,
} from 'libs/locationV2/locationModal.store'

export const SearchLocationModal = () => {
  const { dispatch } = useSearch()

  const {
    hasGeolocPosition,
    setPlaceQuery,
    setSelectedPlace,
    onResetPlace,
    setSelectedLocationMode,
    setAroundPlaceRadius,
    setAroundMeRadius,
    aroundMeRadius,
    setPlace,
    aroundPlaceRadius,
  } = useLocation()

  const { locationMode } = useLocationModal()
  const selectedPlace = useLocationModalPlace()
  const placeQuery = useLocationModalAddressInputValue()
  const { radius: tempAroundMeRadius } = useLocationModalConfiguration(LocationMode.AROUND_ME)
  const { radius: tempAroundPlaceRadius } = useLocationModalConfiguration(LocationMode.AROUND_PLACE)
  const {
    setAroundMeRadius: setTempAroundMeRadius,
    setAroundPlaceRadius: setTempAroundPlaceRadius,
  } = locationModalActions

  const { onSubmit: submitLocation } = getLocationSubmit({
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
    setTempAroundPlaceRadius,
    setTempAroundMeRadius,
  })

  const canSubmit = useCanSubmitLocationModal()
  const selectLocationMode = createSelectLocationMode()

  return (
    <LocationModal
      onSubmit={submitLocation}
      hasGeolocPosition={hasGeolocPosition}
      tempLocationMode={locationMode}
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
      isSubmitDisabled={!canSubmit}
      shouldDisplayEverywhereSection
    />
  )
}
