import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { removeSelectedVenue } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
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

export const VenueMapLocationModal = () => {
  const hasGeolocPosition = useIsGeolocated()

  const { radius: tempAroundMeRadius } = useLocationModalConfiguration(LocationMode.AROUND_ME)
  const { radius: tempAroundPlaceRadius } = useLocationModalConfiguration(LocationMode.AROUND_PLACE)
  const { locationMode } = useLocationModal()
  const selectedPlace = useLocationModalPlace()
  const placeQuery = useLocationModalAddressInputValue()
  const {
    params: { openedFrom, shouldOpenMapInTab },
  } = useRoute<UseRouteType<'VenueMapLocationModal'>>()

  const { replace } = useNavigation<UseNavigationType>()

  const canSubmit = useCanSubmitLocationModal()

  const {
    onTempAroundRadiusPlaceValueChange: onTempAroundPlaceRadiusValueChange,
    onTempAroundMeRadiusValueChange,
  } = useRadiusChange({
    setTempAroundPlaceRadius: locationModalActions.setAroundPlaceRadius,
    setTempAroundMeRadius: locationModalActions.setAroundMeRadius,
  })

  const handleSubmit = () => {
    removeSelectedVenue()
    if (!shouldOpenMapInTab) {
      void analytics.logConsultVenueMap({ from: openedFrom })
      replace('VenueMap')
    }
  }

  return (
    <LocationModal
      from="venueMap"
      onSubmit={handleSubmit}
      hasGeolocPosition={hasGeolocPosition}
      tempLocationMode={locationMode}
      selectedPlace={selectedPlace}
      setSelectedPlace={locationModalActions.setPlace}
      placeQuery={placeQuery}
      setPlaceQuery={locationModalActions.setAddressInputValue}
      onResetPlace={locationModalActions.resetPlace}
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
