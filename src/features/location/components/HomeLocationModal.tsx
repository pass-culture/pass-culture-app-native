import React, { useCallback, useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationModalFooter } from 'features/location/components/LocationModalFooter'
import { analytics } from 'libs/analytics'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/components/spacer/Spacer'
import { BicolorEverywhere } from 'ui/svg/icons/BicolorEverywhere'
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
    place,
    selectedPlace,
    setSelectedPlace,
    onSetSelectedPlace,
    onResetPlace,
    setPlace: setPlaceGlobally,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
    selectedLocationMode,
    setSelectedLocationMode,
  } = useLocation()

  const [tempLocationMode, setTempLocationMode] = useState<LocationMode>(selectedLocationMode)
  const isCurrentLocationMode = (target: LocationMode) => tempLocationMode === target

  useEffect(() => {
    if (visible) {
      setTempLocationMode(selectedLocationMode)
    }
  }, [selectedLocationMode, visible, setTempLocationMode])

  useEffect(() => {
    if (visible) {
      onModalHideRef.current = undefined
      setPlaceQuery(place?.label ?? '')
      setSelectedPlace(place)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const theme = useTheme()

  const geolocationModeColor = isCurrentLocationMode(LocationMode.AROUND_ME)
    ? theme.colors.primary
    : theme.colors.black

  const customLocationModeColor = isCurrentLocationMode(LocationMode.AROUND_PLACE)
    ? theme.colors.primary
    : theme.colors.black

  const everywhereLocationModeColor = isCurrentLocationMode(LocationMode.EVERYWHERE)
    ? theme.colors.primary
    : theme.colors.black

  const runGeolocationDialogs = useCallback(async () => {
    const selectAroundMeMode = () => setSelectedLocationMode(LocationMode.AROUND_ME)
    const selectEverywhereMode = () => setSelectedLocationMode(LocationMode.EVERYWHERE)

    if (permissionState === GeolocPermissionState.GRANTED) {
      selectAroundMeMode()
      setPlaceGlobally(null)
    } else if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      setPlaceGlobally(null)
      selectEverywhereMode()
      onModalHideRef.current = showGeolocPermissionModal
    } else {
      await requestGeolocPermission({
        onAcceptance: selectAroundMeMode,
        onRefusal: selectEverywhereMode,
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
      switch (mode) {
        case LocationMode.AROUND_ME:
          runGeolocationDialogs()
          dismissModal()
          break
        case LocationMode.AROUND_PLACE:
          setTempLocationMode(LocationMode.AROUND_PLACE)
          break
        case LocationMode.EVERYWHERE:
          setTempLocationMode(LocationMode.EVERYWHERE)
          setSelectedLocationMode(LocationMode.EVERYWHERE)
          dismissModal()
          break

        default:
          break
      }
    },
    [dismissModal, runGeolocationDialogs, setSelectedLocationMode]
  )

  const onSubmitPlace = () => {
    setPlaceGlobally(selectedPlace)
    setSelectedLocationMode(tempLocationMode)
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
      }
      fixedModalBottom={
        <LocationModalFooter onSubmit={onSubmitPlace} isSubmitDisabled={!selectedPlace} />
      }>
      <StyledScrollView>
        <Spacer.Column numberOfSpaces={6} />
        <LocationModalButton
          onPress={selectLocationMode(LocationMode.AROUND_ME)}
          icon={PositionFilled}
          color={geolocationModeColor}
          title="Utiliser ma position actuelle"
          subtitle={hasGeolocPosition ? undefined : 'Géolocalisation désactivée'}
        />
        <Spacer.Column numberOfSpaces={6} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={6} />
        <LocationModalButton
          onPress={selectLocationMode(LocationMode.AROUND_PLACE)}
          icon={MagnifyingGlassFilled}
          color={customLocationModeColor}
          title="Choisir une localisation"
          subtitle={LOCATION_PLACEHOLDER}
        />
        {!!isCurrentLocationMode(LocationMode.AROUND_PLACE) && (
          <LocationSearchInput
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            placeQuery={placeQuery}
            setPlaceQuery={setPlaceQuery}
            onResetPlace={onResetPlace}
            onSetSelectedPlace={onSetSelectedPlace}
          />
        )}
        <Spacer.Column numberOfSpaces={6} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={6} />
        <LocationModalButton
          onPress={selectLocationMode(LocationMode.EVERYWHERE)}
          icon={BicolorEverywhere}
          color={everywhereLocationModeColor}
          title="Partout"
        />
      </StyledScrollView>
    </AppModal>
  )
}

const StyledScrollView = styled.ScrollView({
  paddingHorizontal: getSpacing(6),
})

const HeaderContainer = styled.View({
  padding: getSpacing(4),
  width: '100%',
})
