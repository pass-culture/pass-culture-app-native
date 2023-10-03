import React, { useEffect, useState, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationMode } from 'features/location/enums'
import { GeolocPermissionState, useLocation } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { PositionFilled } from 'ui/svg/icons/PositionFilled'

interface LocationModalProps {
  visible: boolean
  dismissModal: () => void
}

const LOCATION_PLACEHOLDER = 'Ville, code postal, adresse'

export const LocationModal = ({ visible, dismissModal }: LocationModalProps) => {
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
    if (permissionState === GeolocPermissionState.GRANTED) {
      selectGeoLocationMode()
      setPlaceGlobally(null)
    } else if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      setPlaceGlobally(null)
      onModalHideRef.current = showGeolocPermissionModal
    } else {
      await requestGeolocPermission({
        onAcceptance: selectGeoLocationMode,
      })
    }
  }, [
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
        dismissModal()
      }
      setSelectedLocationMode(mode)
    },
    [dismissModal, runGeolocationDialogs, setSelectedLocationMode]
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
    setPlaceGlobally(selectedPlace)
    dismissModal()
  }

  const onClose = () => {
    dismissModal()
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
        <LocationSearchInput
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          placeQuery={placeQuery}
          setPlaceQuery={setPlaceQuery}
          onResetPlace={onResetPlace}
          onSetSelectedPlace={onSetSelectedPlace}
        />
      )}
      <Spacer.Column numberOfSpaces={8} />
      <ButtonContainer>
        <ButtonPrimary
          wording={'Valider la localisation'}
          disabled={!selectedPlace}
          onPress={onSubmit}
        />
      </ButtonContainer>
    </AppModal>
  )
}

const ButtonContainer = styled.View({
  alignItems: 'center',
})
