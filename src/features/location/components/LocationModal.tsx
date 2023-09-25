import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationOption } from 'features/location/enums'
import { SuggestedPlaces } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedPlaces'
import { GeolocPermissionState, useLocation } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { theme } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/components/spacer/Spacer'
import { useDebounceValue } from 'ui/hooks/useDebounceValue'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
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
    setPlace: setPlaceGlobally,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useLocation()

  const [placeQuery, setPlaceQuery] = useState('')
  const debouncedPlaceQuery = useDebounceValue(placeQuery, 500)
  const [selectedPlace, setSelectedPlace] = useState<SuggestedPlace | null>(null)
  const defaultOption = isGeolocated ? LocationOption.GEOLOCATION : LocationOption.NONE
  const [selectedOption, setSelectedOption] = React.useState<LocationOption>(defaultOption)

  const initializeLocationMode = useCallback(() => {
    onModalHideRef.current = undefined
    if (isCustomPosition) {
      setSelectedOption(LocationOption.CUSTOM_POSITION)
    } else {
      setSelectedOption(defaultOption)
    }
  }, [onModalHideRef, isCustomPosition, setSelectedOption, defaultOption])

  const isCurrentLocationMode = useCallback(
    (target: LocationOption) => selectedOption === target,
    [selectedOption]
  )

  useEffect(() => {
    if (visible) {
      initializeLocationMode()
    }
  }, [visible, initializeLocationMode])

  const colorForGeolocationMode = isCurrentLocationMode(LocationOption.GEOLOCATION)
    ? theme.colors.primary
    : theme.colors.black

  const runGeolocationDialogs = React.useCallback(async () => {
    const selectGeoLocationOption = () => setSelectedOption(LocationOption.GEOLOCATION)
    if (permissionState === GeolocPermissionState.GRANTED) {
      selectGeoLocationOption()
      setPlaceGlobally(null)
    } else if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      setPlaceGlobally(null)
      onModalHideRef.current = showGeolocPermissionModal
    } else {
      await requestGeolocPermission({
        onAcceptance: selectGeoLocationOption,
      })
    }
  }, [
    permissionState,
    setPlaceGlobally,
    onModalHideRef,
    showGeolocPermissionModal,
    requestGeolocPermission,
  ])

  const selectLocationOption = React.useCallback(
    (option: LocationOption) => () => {
      if (option === LocationOption.GEOLOCATION) {
        runGeolocationDialogs()
        dismissModal()
      }
      setSelectedOption(option)
    },
    [dismissModal, runGeolocationDialogs, setSelectedOption]
  )

  const colorForCustomLocationMode = isCurrentLocationMode(LocationOption.CUSTOM_POSITION)
    ? theme.colors.primary
    : theme.colors.black

  const onResetPlace = () => {
    setSelectedPlace(null)
    setPlaceQuery('')
  }
  const onChangePlace = (text: string) => {
    setSelectedPlace(null)
    setPlaceQuery(text)
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

  const isQueryProvided = !!placeQuery && !!debouncedPlaceQuery
  const shouldShowSuggestedPlaces = isQueryProvided && !selectedPlace

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
        onPress={selectLocationOption(LocationOption.GEOLOCATION)}
        icon={PositionFilled}
        color={colorForGeolocationMode}
        title={'Utiliser ma position actuelle'}
        subtitle={isGeolocated ? undefined : 'Géolocalisation désactivée'}
      />
      <Spacer.Column numberOfSpaces={6} />
      <Separator />
      <Spacer.Column numberOfSpaces={6} />
      <LocationModalButton
        onPress={selectLocationOption(LocationOption.CUSTOM_POSITION)}
        icon={MagnifyingGlassFilled}
        color={colorForCustomLocationMode}
        title={'Choisir une localisation'}
        subtitle={LOCATION_PLACEHOLDER}
      />
      {!!isCurrentLocationMode(LocationOption.CUSTOM_POSITION) && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <SearchInput
            LeftIcon={StyledMagnifyingGlass}
            inputHeight="regular"
            onChangeText={onChangePlace}
            onPressRightIcon={onResetPlace}
            placeholder={LOCATION_PLACEHOLDER}
            value={placeQuery}
          />
          {shouldShowSuggestedPlaces ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <SuggestedPlaces query={debouncedPlaceQuery} setSelectedPlace={onSetSelectedPlace} />
            </React.Fragment>
          ) : null}
        </React.Fragment>
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

const StyledMagnifyingGlass = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
