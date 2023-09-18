import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationOption } from 'features/location/enums'
import { SuggestedPlaces } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedPlaces'
import { useLocation } from 'libs/geolocation'
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
    isCurrentLocationMode,
    noPlace,
    runGeolocationDialogs,
    setPlace,
    setSelectedOption,
    saveAllPositionChanges,
    initialize,
    onModalHideRef,
  } = useLocation()

  const [placeQuery, setPlaceQuery] = useState('')
  const debouncedPlaceQuery = useDebounceValue(placeQuery, 500)

  useEffect(() => {
    if (visible) {
      initialize()
    }
  }, [visible, initialize])

  const colorForGeolocationMode = React.useMemo(
    () =>
      isCurrentLocationMode(LocationOption.GEOLOCATION) ? theme.colors.primary : theme.colors.black,
    [isCurrentLocationMode]
  )

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

  const colorForCustomLocationMode = React.useMemo(
    () =>
      isCurrentLocationMode(LocationOption.CUSTOM_POSITION)
        ? theme.colors.primary
        : theme.colors.black,
    [isCurrentLocationMode]
  )

  const onResetPlace = () => {
    setPlace(null)
    setPlaceQuery('')
  }
  const onChangePlace = (text: string) => {
    setPlace(null)
    setPlaceQuery(text)
  }

  const onSetSelectedPlace = (place: SuggestedPlace) => {
    setPlace(place)
    setPlaceQuery(place.label)
  }

  const onSubmit = () => {
    saveAllPositionChanges()
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
          {!!noPlace && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <SuggestedPlaces query={debouncedPlaceQuery} setSelectedPlace={onSetSelectedPlace} />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={8} />
      <ButtonContainer>
        <ButtonPrimary wording={'Valider la localisation'} disabled={noPlace} onPress={onSubmit} />
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
