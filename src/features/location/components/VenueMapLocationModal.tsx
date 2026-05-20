import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { getLocationSubmit } from 'features/location/helpers/getLocationSubmit'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useLocationState } from 'features/location/helpers/useLocationState'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { Referrals, UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { removeSelectedVenue } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location/LocationWrapper'
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
  setTempLocationMode: setTempLocationModeProp,
  openedFrom,
}: LocationModalProps) => {
  const {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    onResetPlace,
    aroundMeRadius,
    setSelectedLocationMode,
    setAroundPlaceRadius,
    setAroundMeRadius,
    aroundPlaceRadius,
    setPlace,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
    onModalHideRef,
  } = useLocation()

  const {
    tempLocationMode,
    tempAroundPlaceRadius,
    tempAroundMeRadius,
    setTempAroundPlaceRadius,
    setTempAroundMeRadius,
    setTempLocationMode,
  } = useLocationState({
    visible,
  })

  const { navigate } = useNavigation<UseNavigationType>()

  const locationSubmitProps = getLocationSubmit({
    dismissModal,
    from: 'venueMap',
    tempLocationMode,
    tempAroundPlaceRadius,
    tempAroundMeRadius,
    selectedPlace,
    aroundMeRadius,
    setSelectedLocationMode,
    setPlace,
    setTempAroundPlaceRadius,
    setTempAroundMeRadius,
    setAroundPlaceRadius,
    setAroundMeRadius,
    aroundPlaceRadius,
  })
  const { onSubmit, onClose } = locationSubmitProps

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
    shouldOpenDirectlySettings: true,
    setSelectedLocationMode,
    setPlace,
    onModalHideRef,
    hasGeolocPosition,
    tempLocationMode,
    onSubmit,
    permissionState,
    requestGeolocPermission,
    setTempLocationMode,
    showGeolocPermissionModal,
  })

  const handleSubmit = () => {
    removeSelectedVenue()
    setTempLocationModeProp?.(tempLocationMode)
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
