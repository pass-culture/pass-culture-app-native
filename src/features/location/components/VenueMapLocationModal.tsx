import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { getLocationSubmit } from 'features/location/helpers/getLocationSubmit'
import { createSelectLocationMode } from 'features/location/helpers/selectLocationMode'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { removeSelectedVenue } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
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

export const VenueMapLocationModal = () => {
  const {
    hasGeolocPosition,
    setPlaceQuery,
    setSelectedPlace,
    onResetPlace,
    aroundMeRadius,
    setSelectedLocationMode,
    setAroundPlaceRadius,
    setAroundMeRadius,
    aroundPlaceRadius,
    setPlace,
  } = useLocation()

  const { radius: tempAroundMeRadius } = useLocationModalConfiguration(LocationMode.AROUND_ME)
  const { radius: tempAroundPlaceRadius } = useLocationModalConfiguration(LocationMode.AROUND_PLACE)
  const { locationMode } = useLocationModal()
  const selectedPlace = useLocationModalPlace()
  const placeQuery = useLocationModalAddressInputValue()
  const {
    params: { openedFrom, shouldOpenMapInTab },
  } = useRoute<UseRouteType<'VenueMapLocationModal'>>()

  const { replace } = useNavigation<UseNavigationType>()

  const locationSubmitProps = getLocationSubmit({
    from: 'venueMap',
    tempLocationMode: locationMode,
    tempAroundPlaceRadius,
    tempAroundMeRadius,
    selectedPlace,
    aroundMeRadius,
    setSelectedLocationMode,
    setPlace,
    setTempAroundPlaceRadius: locationModalActions.setAroundPlaceRadius,
    setTempAroundMeRadius: locationModalActions.setAroundMeRadius,
    setAroundPlaceRadius,
    setAroundMeRadius,
    aroundPlaceRadius,
  })
  const canSubmit = useCanSubmitLocationModal()
  const { onSubmit } = locationSubmitProps

  const {
    onTempAroundRadiusPlaceValueChange: onTempAroundPlaceRadiusValueChange,
    onTempAroundMeRadiusValueChange,
  } = useRadiusChange({
    setTempAroundPlaceRadius: locationModalActions.setAroundPlaceRadius,
    setTempAroundMeRadius: locationModalActions.setAroundMeRadius,
  })

  const selectLocationMode = createSelectLocationMode()

  const handleSubmit = () => {
    removeSelectedVenue()
    onSubmit()
    if (!shouldOpenMapInTab) {
      void analytics.logConsultVenueMap({ from: openedFrom })
      replace('VenueMap')
    }
  }

  return (
    <LocationModal
      onSubmit={handleSubmit}
      hasGeolocPosition={hasGeolocPosition}
      tempLocationMode={locationMode}
      selectLocationMode={selectLocationMode}
      selectedPlace={selectedPlace}
      setSelectedPlace={setSelectedPlace}
      placeQuery={placeQuery}
      setPlaceQuery={setPlaceQuery}
      onResetPlace={onResetPlace}
      shouldShowRadiusSlider
      isSubmitDisabled={!canSubmit}
      tempAroundPlaceRadius={tempAroundPlaceRadius}
      onTempAroundMeRadiusValueChange={onTempAroundMeRadiusValueChange}
      onTempAroundPlaceRadiusValueChange={onTempAroundPlaceRadiusValueChange}
      tempAroundMeRadius={tempAroundMeRadius}
      buttonWording="Valider et voir sur la carte"
      shouldDisplayEverywhereSection={false}
    />
  )
}
