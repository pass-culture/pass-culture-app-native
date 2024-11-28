import React from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationModalFooter } from 'features/location/components/LocationModalFooter'
import { LOCATION_PLACEHOLDER } from 'features/location/constants'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useLocationState } from 'features/location/helpers/useLocationState'
import { analytics } from 'libs/analytics'
import { LocationMode } from 'libs/location/types'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { PositionFilled } from 'ui/svg/icons/PositionFilled'
import { WorldPosition } from 'ui/svg/icons/WorldPosition'
import { getSpacing } from 'ui/theme'

interface LocationModalProps {
  visible: boolean
  dismissModal: () => void
}

export const HomeLocationModal = ({ visible, dismissModal }: LocationModalProps) => {
  const locationStateProps = useLocationState({
    visible,
  })

  const onSubmitPlace = () => {
    setPlaceGlobally(selectedPlace)
    setSelectedLocationMode(tempLocationMode)
    analytics.logUserSetLocation('home')
    dismissModal()
  }

  const onClose = () => {
    dismissModal()
  }

  const {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    onResetPlace,
    tempLocationMode,
    onModalHideRef,
    setPlaceGlobally,
    setSelectedLocationMode,
    onSetSelectedPlace,
  } = locationStateProps
  const { selectLocationMode } = useLocationMode({
    dismissModal,
    onSubmit: onSubmitPlace,
    onClose,
    shouldDirectlyValidate: true,
    ...locationStateProps,
  })

  const isCurrentLocationMode = (target: LocationMode) => tempLocationMode === target

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
        {isCurrentLocationMode(LocationMode.AROUND_PLACE) ? (
          <LocationSearchInput
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            placeQuery={placeQuery}
            setPlaceQuery={setPlaceQuery}
            onResetPlace={onResetPlace}
            onSetSelectedPlace={onSetSelectedPlace}
          />
        ) : null}
        <Spacer.Column numberOfSpaces={6} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={6} />
        <LocationModalButton
          onPress={selectLocationMode(LocationMode.EVERYWHERE)}
          icon={WorldPosition}
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
