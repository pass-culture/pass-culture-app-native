import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { useLocation } from 'libs/location/useLocation'
import {
  useCanSubmitLocationModal,
  useLocationModal,
  useLocationModalAddressInputValue,
  useLocationModalPlace,
} from 'libs/locationV2/locationModal.store'

export const HomeLocationModal = () => {
  const { hasGeolocPosition, setPlaceQuery, setSelectedPlace, onResetPlace } = useLocation()
  const selectedPlace = useLocationModalPlace()
  const placeQuery = useLocationModalAddressInputValue()
  const { locationMode } = useLocationModal()
  const canSubmit = useCanSubmitLocationModal()

  return (
    <LocationModal
      from="home"
      hasGeolocPosition={hasGeolocPosition}
      tempLocationMode={locationMode}
      selectedPlace={selectedPlace}
      setSelectedPlace={setSelectedPlace}
      placeQuery={placeQuery}
      setPlaceQuery={setPlaceQuery}
      onResetPlace={onResetPlace}
      shouldShowRadiusSlider={false}
      isSubmitDisabled={!canSubmit}
      shouldDisplayEverywhereSection
    />
  )
}
