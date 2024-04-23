import React, { useCallback, useState, useEffect } from 'react'
import { Keyboard, Linking } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationModalFooter } from 'features/location/components/LocationModalFooter'
import { LOCATION_PLACEHOLDER } from 'features/location/constants'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { analytics } from 'libs/analytics'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { LocationSearchFilters } from 'shared/location/LocationSearchFilters'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
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

export const VenueMapLocationModal = ({ visible, dismissModal }: LocationModalProps) => {
  const {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    onSetSelectedPlace,
    onResetPlace,
    setPlace: setPlaceGlobally,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    aroundPlaceRadius,
    setAroundPlaceRadius,
    aroundMeRadius,
    setAroundMeRadius,
    selectedLocationMode,
    setSelectedLocationMode,
    place,
  } = useLocation()
  const [tempAroundMeRadius, setTempAroundMeRadius] = useState<number>(DEFAULT_RADIUS)
  const [tempAroundPlaceRadius, setTempAroundPlaceRadius] = useState<number>(DEFAULT_RADIUS)
  const [tempLocationMode, setTempLocationMode] = useState<LocationMode>(selectedLocationMode)
  const isCurrentLocationMode = (target: LocationMode) => tempLocationMode === target

  useEffect(() => {
    if (visible) {
      setTempLocationMode(selectedLocationMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocationMode, visible])

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

  const runGeolocationDialogs = useCallback(async () => {
    const selectGeoLocationMode = () => setTempLocationMode(LocationMode.AROUND_ME)
    const selectEverywhereMode = () => setSelectedLocationMode(LocationMode.EVERYWHERE)

    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      setPlaceGlobally(null)
      selectEverywhereMode()
      Linking.openSettings()
    } else {
      await requestGeolocPermission({
        onAcceptance: selectGeoLocationMode,
        onRefusal: selectEverywhereMode,
      })
    }
  }, [permissionState, setSelectedLocationMode, setPlaceGlobally, requestGeolocPermission])

  const selectLocationMode = (mode: LocationMode) => () => {
    switch (mode) {
      case LocationMode.AROUND_ME:
        runGeolocationDialogs()
        break

      case LocationMode.EVERYWHERE:
        setTempLocationMode(LocationMode.EVERYWHERE)
        onSubmit(LocationMode.EVERYWHERE)
        break

      default:
        setTempLocationMode(mode)
        break
    }
  }

  const onSubmit = (mode?: LocationMode) => {
    const chosenLocationMode = mode ?? tempLocationMode
    setSelectedLocationMode(chosenLocationMode)
    switch (chosenLocationMode) {
      case LocationMode.AROUND_PLACE:
        if (selectedPlace) {
          setPlaceGlobally(selectedPlace)
          setAroundPlaceRadius(tempAroundPlaceRadius)
          setTempAroundMeRadius(DEFAULT_RADIUS)
          analytics.logUserSetLocation('search')
        }
        break

      case LocationMode.AROUND_ME:
        setPlaceGlobally(null)
        setAroundMeRadius(tempAroundMeRadius)
        setTempAroundPlaceRadius(DEFAULT_RADIUS)
        break

      case LocationMode.EVERYWHERE:
        setPlaceGlobally(null)
        break
    }

    dismissModal()
  }

  const onClose = () => {
    setTempAroundMeRadius(aroundMeRadius)
    setTempAroundPlaceRadius(aroundPlaceRadius)
    dismissModal()
  }

  const onTempAroundRadiusPlaceValueChange = useCallback(
    (newValues: number[]) => {
      if (visible) {
        // @ts-expect-error: because of noUncheckedIndexedAccess
        setTempAroundPlaceRadius(newValues[0])
      }
    },
    [visible, setTempAroundPlaceRadius]
  )
  const onTempAroundMeRadiusValueChange = useCallback(
    (newValues: number[]) => {
      if (visible) {
        // @ts-expect-error: because of noUncheckedIndexedAccess
        setTempAroundMeRadius(newValues[0])
      }
    },
    [visible, setTempAroundMeRadius]
  )

  const onPlaceSelection = (place: SuggestedPlace) => {
    onSetSelectedPlace(place)
    Keyboard.dismiss()
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
        <LocationModalFooter
          onSubmit={() => onSubmit()}
          isSubmitDisabled={!selectedPlace && tempLocationMode !== LocationMode.AROUND_ME}
          buttonWording="Valider et voir sur la carte"
        />
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
        {!!isCurrentLocationMode(LocationMode.AROUND_ME) && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={4} />
            <LocationSearchFilters
              aroundRadius={tempAroundMeRadius}
              onValuesChange={onTempAroundMeRadiusValueChange}
            />
          </React.Fragment>
        )}
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
          <React.Fragment>
            <LocationSearchInput
              selectedPlace={selectedPlace}
              setSelectedPlace={setSelectedPlace}
              placeQuery={placeQuery}
              setPlaceQuery={setPlaceQuery}
              onResetPlace={onResetPlace}
              onSetSelectedPlace={onPlaceSelection}
            />
            <Spacer.Column numberOfSpaces={4} />
            {!!selectedPlace && (
              <LocationSearchFilters
                aroundRadius={tempAroundPlaceRadius}
                onValuesChange={onTempAroundRadiusPlaceValueChange}
              />
            )}
          </React.Fragment>
        )}
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
