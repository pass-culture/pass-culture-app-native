import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { LocationMode } from 'libs/location/types'
import { useIsGeolocated } from 'libs/locationV2/location.store'
import {
  locationModalActions,
  useCanSubmitLocationModal,
  useLocationModal,
  useLocationModalAddressInputValue,
  useLocationModalConfiguration,
  useLocationModalPlace,
} from 'libs/locationV2/locationModal.store'

export const SearchLocationModal = () => {
  const hasGeolocPosition = useIsGeolocated()

  const { locationMode } = useLocationModal()
  const selectedPlace = useLocationModalPlace()
  const placeQuery = useLocationModalAddressInputValue()
  const { radius: tempAroundMeRadius } = useLocationModalConfiguration(LocationMode.AROUND_ME)
  const { radius: tempAroundPlaceRadius } = useLocationModalConfiguration(LocationMode.AROUND_PLACE)
  const {
    setAroundMeRadius: setTempAroundMeRadius,
    setAroundPlaceRadius: setTempAroundPlaceRadius,
  } = locationModalActions

  const {
    onTempAroundRadiusPlaceValueChange: onTempAroundPlaceRadiusValueChange,
    onTempAroundMeRadiusValueChange,
  } = useRadiusChange({
    setTempAroundPlaceRadius,
    setTempAroundMeRadius,
  })

  const canSubmit = useCanSubmitLocationModal()

  return (
    <LocationModal
      from="search"
      hasGeolocPosition={hasGeolocPosition}
      tempLocationMode={locationMode}
      selectedPlace={selectedPlace}
      setSelectedPlace={locationModalActions.setPlace}
      placeQuery={placeQuery}
      setPlaceQuery={locationModalActions.setAddressInputValue}
      onResetPlace={locationModalActions.resetPlace}
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
