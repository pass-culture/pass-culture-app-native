import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useLocationState } from 'features/location/helpers/useLocationState'
import { useLocationSubmit } from 'features/location/helpers/useLocationSubmit'
import { usePlaceSelection } from 'features/location/helpers/usePlaceSelection'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { Referrals, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { initialVenuesActions } from 'features/venueMap/store/initialVenuesStore'
import { selectedVenueActions } from 'features/venueMap/store/selectedVenueStore'
import { analytics } from 'libs/analytics'
import { LocationMode } from 'libs/location/types'

interface LocationModalProps {
  visible: boolean
  dismissModal: () => void
  openedFrom: Referrals
  shouldOpenMapInTab?: boolean
  setTempLocationMode?: React.Dispatch<React.SetStateAction<LocationMode>>
}

export const VenueMapLocationModal = ({
  visible,
  dismissModal,
  shouldOpenMapInTab,
  setTempLocationMode,
  openedFrom,
}: LocationModalProps) => {
  const locationStateProps = useLocationState({
    visible,
  })
  const { navigate } = useNavigation<UseNavigationType>()
  const {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    onResetPlace,
    tempLocationMode,
    onModalHideRef,
    tempAroundPlaceRadius,
    tempAroundMeRadius,
  } = locationStateProps

  const locationSubmitProps = useLocationSubmit({
    dismissModal,
    from: 'venueMap',
    ...locationStateProps,
  })
  const { onSubmit, onClose } = locationSubmitProps

  const {
    onTempAroundRadiusPlaceValueChange: onTempAroundPlaceRadiusValueChange,
    onTempAroundMeRadiusValueChange,
  } = useRadiusChange({
    visible,
    ...locationStateProps,
  })
  const { onPlaceSelection: onSetSelectedPlace } = usePlaceSelection({
    ...locationStateProps,
  })
  const { selectLocationMode } = useLocationMode({
    dismissModal,
    shouldOpenDirectlySettings: true,
    ...locationStateProps,
    ...locationSubmitProps,
  })

  const { removeSelectedVenue } = selectedVenueActions
  const { setInitialVenues } = initialVenuesActions

  useEffect(() => {
    setInitialVenues([])
  }, [setInitialVenues])

  const handleSubmit = () => {
    removeSelectedVenue()
    setTempLocationMode?.(tempLocationMode)
    onSubmit()
    if (!shouldOpenMapInTab) {
      analytics.logConsultVenueMap({ from: openedFrom })
      navigate('VenueMap')
    }
  }

  return (
    <LocationModal
      visible={visible}
      onSubmit={handleSubmit}
      hasGeolocPosition={hasGeolocPosition}
      tempLocationMode={tempLocationMode}
      onClose={onClose}
      selectLocationMode={selectLocationMode}
      onModalHideRef={onModalHideRef}
      selectedPlace={selectedPlace}
      setSelectedPlace={setSelectedPlace}
      placeQuery={placeQuery}
      setPlaceQuery={setPlaceQuery}
      onSetSelectedPlace={onSetSelectedPlace}
      onResetPlace={onResetPlace}
      shouldShowRadiusSlider
      isSubmitDisabled={!selectedPlace && tempLocationMode !== LocationMode.AROUND_ME}
      tempAroundPlaceRadius={tempAroundPlaceRadius}
      onTempAroundMeRadiusValueChange={onTempAroundMeRadiusValueChange}
      onTempAroundPlaceRadiusValueChange={onTempAroundPlaceRadiusValueChange}
      tempAroundMeRadius={tempAroundMeRadius}
      buttonWording="Valider et voir sur la carte"
      shouldDisplayEverywhereSection={false}
    />
  )
}
