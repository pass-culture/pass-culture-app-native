import React from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useLocationState } from 'features/location/helpers/useLocationState'
import { useLocationSubmit } from 'features/location/helpers/useLocationSubmit'
import { usePlaceSelection } from 'features/location/helpers/usePlaceSelection'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationMode } from 'libs/location/types'

interface LocationModalProps {
  visible: boolean
  dismissModal: () => void
}

export const SearchLocationModal = ({ visible, dismissModal }: LocationModalProps) => {
  const { dispatch } = useSearch()
  const locationStateProps = useLocationState({
    visible,
  })
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

  const { onSubmit, onClose } = useLocationSubmit({
    dismissModal,
    from: 'search',
    dispatch,
    ...locationStateProps,
  })
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
    ...locationStateProps,
    onSubmit,
    onClose,
  })
  return (
    <LocationModal
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
      shouldShowRadiusSlider
      tempAroundPlaceRadius={tempAroundPlaceRadius}
      onTempAroundMeRadiusValueChange={onTempAroundMeRadiusValueChange}
      onTempAroundPlaceRadiusValueChange={onTempAroundPlaceRadiusValueChange}
      tempAroundMeRadius={tempAroundMeRadius}
      isSubmitDisabled={!selectedPlace && tempLocationMode !== LocationMode.AROUND_ME}
      shouldDisplayEverywhereSection
    />
  )
}
