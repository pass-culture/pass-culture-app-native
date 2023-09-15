import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationOption } from 'features/location/enums'
import { SuggestedPlaces } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedPlaces'
import { GeolocPermissionState, useLocation } from 'libs/geolocation'
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
  const { userPosition, permissionState, requestGeolocPermission, showGeolocPermissionModal } =
    useLocation()

  const isGeolocated = !!userPosition
  const defaultOption = isGeolocated ? LocationOption.GEOLOCATION : LocationOption.NONE
  const [selectedOption, setSelectedOption] = React.useState<LocationOption>(defaultOption)
  const [place, setPlace] = useState(null)
  const [placeQuery, setPlaceQuery] = useState('')
  const debouncedPlaceQuery = useDebounceValue(placeQuery, 500)

  const onHideRef = useRef<() => void>()

  useEffect(() => {
    if (visible) {
      setPlaceQuery('')
      setPlace(null)
      setSelectedOption(defaultOption)
      onHideRef.current = undefined
    }
  }, [visible, defaultOption])

  const onSubmit = () => {
    dismissModal()
  }

  const onClose = () => {
    dismissModal()
  }

  const onGeolocationButtonPressed = async () => {
    const selectButton = () => setSelectedOption(LocationOption.GEOLOCATION)

    if (permissionState === GeolocPermissionState.GRANTED) {
      selectButton()
    } else if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      dismissModal()
      onHideRef.current = showGeolocPermissionModal
    } else {
      await requestGeolocPermission({
        onAcceptance: selectButton,
      })
    }
  }

  const onButtonPressed = (option: LocationOption) => () => {
    if (option === LocationOption.GEOLOCATION) {
      onGeolocationButtonPressed()
      return
    }
    setSelectedOption(option)
  }

  const onResetPlace = () => {
    setPlace(null)
    setPlaceQuery('')
  }
  const onChangePlace = (text: string) => {
    setPlace(null)
    setPlaceQuery(text)
  }

  const onSetSelectedPlace = (place: SuggestedPlace) => {
    setPlaceQuery(place.label)
    setPlace(place)
  }

  const cannotSubmit = place === null
  const showUserLocation = selectedOption === LocationOption.CUSTOM_POSITION

  return (
    <AppModal
      visible={visible}
      title={'Localisation'}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={onClose}
      isUpToStatusBar
      scrollEnabled={false}
      onModalHide={onHideRef.current}>
      <Spacer.Column numberOfSpaces={6} />
      <LocationModalButton
        onPress={onButtonPressed(LocationOption.GEOLOCATION)}
        icon={PositionFilled}
        color={
          selectedOption === LocationOption.GEOLOCATION ? theme.colors.primary : theme.colors.black
        }
        title={'Utiliser ma position actuelle'}
        subtitle={isGeolocated ? undefined : 'Géolocalisation désactivée'}
      />
      <Spacer.Column numberOfSpaces={6} />
      <Separator />
      <Spacer.Column numberOfSpaces={6} />
      <LocationModalButton
        onPress={onButtonPressed(LocationOption.CUSTOM_POSITION)}
        icon={MagnifyingGlassFilled}
        color={
          selectedOption === LocationOption.CUSTOM_POSITION
            ? theme.colors.primary
            : theme.colors.black
        }
        title={'Choisir une localisation'}
        subtitle={LOCATION_PLACEHOLDER}
      />
      {!!showUserLocation && (
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
          {!place && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <SuggestedPlaces query={debouncedPlaceQuery} setSelectedPlace={onSetSelectedPlace} />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={8} />
      <ButtonContainer>
        <ButtonPrimary
          wording={'Valider la localisation'}
          disabled={cannotSubmit}
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
