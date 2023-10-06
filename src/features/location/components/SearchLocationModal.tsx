import React, { useEffect, useState, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LOCATION_PLACEHOLDER } from 'features/location/constants'
import { LocationMode } from 'features/location/enums'
import { GeolocPermissionState, useLocation } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
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
    isCustomPosition,
    place,
    setPlace: setPlaceGlobally,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useLocation()

  const theme = useTheme()

  const [placeQuery, setPlaceQuery] = useState('')
  const [aroundRadius, setAroundRadius] = useState(100)
  const [includeDigitalOffers, setIncludeDigitalOffers] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<SuggestedPlace | null>(null)
  const defaultLocationMode = isGeolocated ? LocationMode.GEOLOCATION : LocationMode.NONE
  const [selectedLocationMode, setSelectedLocationMode] =
    useState<LocationMode>(defaultLocationMode)

  const initializeLocationMode = useCallback(() => {
    onModalHideRef.current = undefined
    if (isCustomPosition) {
      setSelectedLocationMode(LocationMode.CUSTOM_POSITION)
    } else {
      setSelectedLocationMode(defaultLocationMode)
    }
  }, [onModalHideRef, isCustomPosition, setSelectedLocationMode, defaultLocationMode])

  const isCurrentLocationMode = (target: LocationMode) => selectedLocationMode === target

  useEffect(() => {
    if (visible) {
      initializeLocationMode()
      if (place) {
        onSetSelectedPlace(place)
      } else {
        onResetPlace()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initializeLocationMode])

  const geolocationModeColor = isCurrentLocationMode(LocationMode.GEOLOCATION)
    ? theme.colors.primary
    : theme.colors.black

  const customLocationModeColor = isCurrentLocationMode(LocationMode.CUSTOM_POSITION)
    ? theme.colors.primary
    : theme.colors.black

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

  const onResetPlace = () => {
    setSelectedPlace(null)
    setPlaceQuery('')
  }

  const onSetSelectedPlace = (place: SuggestedPlace) => {
    setSelectedPlace(place)
    setPlaceQuery(place.label)
  }

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
      {!!isCurrentLocationMode(LocationMode.GEOLOCATION) && (
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
      {!!isCurrentLocationMode(LocationMode.CUSTOM_POSITION) && (
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
