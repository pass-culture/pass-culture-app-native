import React, { useState, useCallback } from 'react'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LOCATION_PLACEHOLDER } from 'features/location/constants'
import { LocationMode } from 'features/location/enums'
import { isCurrentLocationMode } from 'features/location/helpers/locationHelpers'
import { useLocationModal } from 'features/location/helpers/useLocationModal'
import { GeolocPermissionState } from 'libs/geolocation'
import { LocationSearchFilters } from 'shared/location/LocationSearchFilters'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Close } from 'ui/svg/icons/Close'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { PositionFilled } from 'ui/svg/icons/PositionFilled'
import { Typo } from 'ui/theme'

interface LocationModalProps {
  visible: boolean
  dismissModal: () => void
  showVenueModal: () => void
}

export const SearchLocationModal = ({
  visible,
  dismissModal,
  showVenueModal,
}: LocationModalProps) => {
  const {
    isGeolocated,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    selectedLocationMode,
    setSelectedLocationMode,
    geolocationModeColor,
    customLocationModeColor,
    onSetSelectedPlace,
    onResetPlace,
    setPlaceGlobally,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useLocationModal(visible)

  const [aroundRadius, setAroundRadius] = useState(100)
  const [includeDigitalOffers, setIncludeDigitalOffers] = useState(false)

  const runGeolocationDialogs = useCallback(async () => {
    const selectGeoLocationMode = () => setSelectedLocationMode(LocationMode.GEOLOCATION)
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      setPlaceGlobally(null)
      dismissModal()
      onModalHideRef.current = showGeolocPermissionModal
    } else {
      await requestGeolocPermission({
        onAcceptance: selectGeoLocationMode,
      })
    }
  }, [
    dismissModal,
    permissionState,
    setPlaceGlobally,
    onModalHideRef,
    showGeolocPermissionModal,
    requestGeolocPermission,
    setSelectedLocationMode,
  ])

  const selectLocationMode = useCallback(
    (mode: LocationMode) => () => {
      if (mode === LocationMode.GEOLOCATION) {
        runGeolocationDialogs()
      } else {
        setSelectedLocationMode(mode)
      }
    },
    [runGeolocationDialogs, setSelectedLocationMode]
  )

  const onSubmit = () => {
    if (selectedLocationMode === LocationMode.CUSTOM_POSITION) {
      setPlaceGlobally(selectedPlace)
    } else if (selectedLocationMode === LocationMode.GEOLOCATION) {
      setPlaceGlobally(null)
    }
    dismissModal()
  }

  const onClose = () => {
    dismissModal()
  }

  const onValuesChange = useCallback(
    (newValues: number[]) => {
      setAroundRadius(newValues[0])
    },
    [setAroundRadius]
  )

  const onPressShowVenueModal = () => {
    dismissModal()
    onModalHideRef.current = showVenueModal
  }

  return (
    <AppModal
      visible={visible}
      title={'Localisation'}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={onClose}
      isUpToStatusBar
      scrollEnabled={false}
      onModalHide={onModalHideRef.current}>
      <Spacer.Column numberOfSpaces={6} />
      <LocationModalButton
        onPress={selectLocationMode(LocationMode.GEOLOCATION)}
        icon={PositionFilled}
        color={geolocationModeColor}
        title={'Utiliser ma position actuelle'}
        subtitle={isGeolocated ? undefined : 'Géolocalisation désactivée'}
      />
      {!!isCurrentLocationMode(selectedLocationMode, LocationMode.GEOLOCATION) && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <LocationSearchFilters
            aroundRadius={aroundRadius}
            onValuesChange={onValuesChange}
            includeDigitalOffers={includeDigitalOffers}
            setIncludeDigitalOffers={setIncludeDigitalOffers}
          />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={6} />
      <Separator />
      <Spacer.Column numberOfSpaces={6} />
      <LocationModalButton
        onPress={selectLocationMode(LocationMode.CUSTOM_POSITION)}
        icon={MagnifyingGlassFilled}
        color={customLocationModeColor}
        title={'Choisir une localisation'}
        subtitle={LOCATION_PLACEHOLDER}
      />
      {!!isCurrentLocationMode(selectedLocationMode, LocationMode.CUSTOM_POSITION) && (
        <React.Fragment>
          <LocationSearchInput
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            placeQuery={placeQuery}
            setPlaceQuery={setPlaceQuery}
            onResetPlace={onResetPlace}
            onSetSelectedPlace={onSetSelectedPlace}
          />
          <Spacer.Column numberOfSpaces={4} />
          {!!selectedPlace && (
            <LocationSearchFilters
              aroundRadius={aroundRadius}
              onValuesChange={onValuesChange}
              includeDigitalOffers={includeDigitalOffers}
              setIncludeDigitalOffers={setIncludeDigitalOffers}
            />
          )}
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={8} />
      <ButtonContainer>
        <ButtonPrimary
          wording={'Valider la localisation'}
          disabled={!selectedPlace && selectedLocationMode !== LocationMode.GEOLOCATION}
          onPress={onSubmit}
        />
      </ButtonContainer>
      <Spacer.Column numberOfSpaces={8} />
      <Separator />
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>Tu peux aussi choisir un point de vente précis</Typo.Body>
      <Spacer.Column numberOfSpaces={1} />
      <ButtonTertiaryBlack
        wording="Trouver un point de vente"
        icon={LocationBuildingFilled}
        onPress={onPressShowVenueModal}
        justifyContent={'flex-start'}
      />
    </AppModal>
  )
}

const ButtonContainer = styled.View({
  alignItems: 'center',
})
