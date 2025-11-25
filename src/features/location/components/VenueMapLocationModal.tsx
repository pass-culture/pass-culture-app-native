import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { getLocationSubmit } from 'features/location/helpers/getLocationSubmit'
import { getPlaceSelection } from 'features/location/helpers/getPlaceSelection'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useLocationState } from 'features/location/helpers/useLocationState'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { Referrals, UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { removeSelectedVenue } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
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

  const locationSubmitProps = getLocationSubmit({
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
  const { onPlaceSelection: onSetSelectedPlace } = getPlaceSelection({
    ...locationStateProps,
  })
  const { selectLocationMode } = useLocationMode({
    dismissModal,
    shouldOpenDirectlySettings: true,
    ...locationStateProps,
    ...locationSubmitProps,
  })

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
