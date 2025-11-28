import React from 'react'

import { LocationModalOLD } from 'features/location/components/LocationModalOld'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useLocationState } from 'features/location/helpers/useLocationState'
import { analytics } from 'libs/analytics/provider'

interface HomeLocationModalProps {
  visible: boolean
  dismissModal: () => void
}

export const HomeLocationModal = ({ visible, dismissModal }: HomeLocationModalProps) => {
  const locationStateProps = useLocationState({
    visible,
  })

  const onSubmit = () => {
    setPlaceGlobally(selectedPlace)
    setSelectedLocationMode(tempLocationMode)
    analytics.logUserSetLocation('home')
    dismissModal()
  }

  const onClose = () => {
    dismissModal()
  }

  const {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    onResetPlace,
    tempLocationMode,
    onModalHideRef,
    setPlaceGlobally,
    setSelectedLocationMode,
    onSetSelectedPlace,
  } = locationStateProps

  const { selectLocationMode } = useLocationMode({
    dismissModal,
    onSubmit,
    onClose,
    shouldDirectlyValidate: true,
    ...locationStateProps,
  })

  return (
    <LocationModalOLD
      visible={visible}
      onSubmit={onSubmit}
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
      shouldShowRadiusSlider={false}
      isSubmitDisabled={!selectedPlace}
      shouldDisplayEverywhereSection
    />
  )
}
