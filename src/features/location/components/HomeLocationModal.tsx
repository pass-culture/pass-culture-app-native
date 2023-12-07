import React, { useCallback } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { analytics } from 'libs/analytics'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { PositionFilled } from 'ui/svg/icons/PositionFilled'
import { getSpacing } from 'ui/theme'

interface LocationModalProps {
  visible: boolean
  dismissModal: () => void
}

const LOCATION_PLACEHOLDER = 'Ville, code postal, adresse'

export const HomeLocationModal = ({ visible, dismissModal }: LocationModalProps) => {
  const {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    setSelectedLocationMode,
    onSetSelectedPlace,
    onResetPlace,
    setPlace: setPlaceGlobally,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
    isCurrentLocationMode,
  } = useLocation()

  const theme = useTheme()

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
    setSelectedLocationMode,
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

  const onSubmit = () => {
    setPlaceGlobally(selectedPlace)
    analytics.logUserSetLocation('home')
    dismissModal()
  }

  const onClose = () => {
    dismissModal()
  }

  return (
    <AppModal
      visible={visible}
      title=""
      noPadding
      isUpToStatusBar
      scrollEnabled={false}
      onModalHide={onModalHideRef.current}
      keyboardShouldPersistTaps="handled"
      customModalHeader={
        <HeaderContainer>
          <ModalHeader
            title="Localisation"
            rightIconAccessibilityLabel="Fermer la modale"
            rightIcon={Close}
            onRightIconPress={onClose}
          />
        </HeaderContainer>
      }>
      <StyledScrollView>
        <Spacer.Column numberOfSpaces={6} />
        <LocationModalButton
          onPress={selectLocationMode(LocationMode.GEOLOCATION)}
          icon={PositionFilled}
          color={geolocationModeColor}
          title="Utiliser ma position actuelle"
          subtitle={hasGeolocPosition ? undefined : 'Géolocalisation désactivée'}
        />
        <Spacer.Column numberOfSpaces={6} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={6} />
        <LocationModalButton
          onPress={selectLocationMode(LocationMode.CUSTOM_POSITION)}
          icon={MagnifyingGlassFilled}
          color={customLocationModeColor}
          title="Choisir une localisation"
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
            wording="Valider la localisation"
            disabled={!selectedPlace}
            onPress={onSubmit}
          />
        </ButtonContainer>
      </StyledScrollView>
    </AppModal>
  )
}

const ButtonContainer = styled.View({
  alignItems: 'center',
})

const StyledScrollView = styled.ScrollView({
  paddingHorizontal: getSpacing(6),
})

const HeaderContainer = styled.View({
  padding: getSpacing(4),
  width: '100%',
})
