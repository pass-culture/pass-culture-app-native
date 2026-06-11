import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { createSelectLocationMode } from 'features/location/helpers/selectLocationMode'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location/useLocation'
import {
  locationModalActions,
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

  const onSubmit = () => {
    locationModalActions.submit()
    void analytics.logUserSetLocation('home')
  }

  const selectLocationMode = createSelectLocationMode()

  return (
    <LocationModal
      onSubmit={onSubmit}
      hasGeolocPosition={hasGeolocPosition}
      tempLocationMode={locationMode}
      selectLocationMode={selectLocationMode}
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
