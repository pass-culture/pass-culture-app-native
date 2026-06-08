import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { getLocationSubmit } from 'features/location/helpers/getLocationSubmit'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { Referrals, UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { removeSelectedVenue } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { LocationMode } from 'libs/location/types'
import { useLocation } from 'libs/location/useLocation'
import {
  locationModalActions,
  useLocationModal,
  useLocationModalConfiguration,
} from 'libs/locationV2/locationModal.store'

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
  } = useLocation()

  const { radius: tempAroundMeRadius } = useLocationModalConfiguration(LocationMode.AROUND_ME)
  const { radius: tempAroundPlaceRadius } = useLocationModalConfiguration(LocationMode.AROUND_PLACE)
  const { locationMode } = useLocationModal()

  const { navigate } = useNavigation<UseNavigationType>()

  const locationSubmitProps = getLocationSubmit({
    dismissModal,
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
  const { onSubmit, onClose } = locationSubmitProps

  const {
    onTempAroundRadiusPlaceValueChange: onTempAroundPlaceRadiusValueChange,
    onTempAroundMeRadiusValueChange,
  } = useRadiusChange({
    visible,
    setTempAroundPlaceRadius: locationModalActions.setAroundPlaceRadius,
    setTempAroundMeRadius: locationModalActions.setAroundMeRadius,
  })
  const { selectLocationMode } = useLocationMode({
    dismissModal,
    shouldOpenDirectlySettings: true,
    setSelectedLocationMode,
    setPlace,
    hasGeolocPosition,
    tempLocationMode: locationMode,
    onSubmit,
    permissionState,
    requestGeolocPermission,
    setTempLocationMode: locationModalActions.setLocationMode,
    showGeolocPermissionModal,
  })

  const handleSubmit = () => {
    removeSelectedVenue()
    setTempLocationModeProp?.(locationMode)
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
      tempLocationMode={locationMode}
      onClose={onClose}
      selectLocationMode={selectLocationMode}
      selectedPlace={selectedPlace}
      setSelectedPlace={setSelectedPlace}
      placeQuery={placeQuery}
      setPlaceQuery={setPlaceQuery}
      onResetPlace={onResetPlace}
      shouldShowRadiusSlider
      isSubmitDisabled={!selectedPlace && locationMode !== LocationMode.AROUND_ME}
      tempAroundPlaceRadius={tempAroundPlaceRadius}
      onTempAroundMeRadiusValueChange={onTempAroundMeRadiusValueChange}
      onTempAroundPlaceRadiusValueChange={onTempAroundPlaceRadiusValueChange}
      tempAroundMeRadius={tempAroundMeRadius}
      buttonWording="Valider et voir sur la carte"
      shouldDisplayEverywhereSection={false}
    />
  )
}
