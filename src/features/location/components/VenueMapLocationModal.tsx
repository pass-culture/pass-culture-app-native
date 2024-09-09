import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationModalFooter } from 'features/location/components/LocationModalFooter'
import { LOCATION_PLACEHOLDER } from 'features/location/constants'
import { useLocationMode } from 'features/location/helpers/useLocationMode'
import { useLocationState } from 'features/location/helpers/useLocationState'
import { useLocationSubmit } from 'features/location/helpers/useLocationSubmit'
import { usePlaceSelection } from 'features/location/helpers/usePlaceSelection'
import { useRadiusChange } from 'features/location/helpers/useRadiusChange'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useSelectedVenueActions } from 'features/venueMap/store/selectedVenueStore'
import { LocationMode } from 'libs/location/types'
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
  shouldOpenMapInTab?: boolean
  setTempLocationMode?: React.Dispatch<React.SetStateAction<LocationMode>>
}

export const VenueMapLocationModal = ({
  visible,
  dismissModal,
  shouldOpenMapInTab,
  setTempLocationMode,
}: LocationModalProps) => {
  const locationStateProps = useLocationState({
    visible,
  })
  const { navigate } = useNavigation<UseNavigationType>()
  const {
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    onResetPlace,
    tempLocationMode,
    onModalHideRef,
    tempAroundPlaceRadius,
    tempAroundMeRadius,
  } = locationStateProps
  const locationSubmitProps = useLocationSubmit({
    dismissModal,
    from: 'venueMap',
    ...locationStateProps,
  })
  const { onSubmit, onClose } = locationSubmitProps
  const { onTempAroundRadiusPlaceValueChange, onTempAroundMeRadiusValueChange } = useRadiusChange({
    visible,
    ...locationStateProps,
  })
  const { onPlaceSelection } = usePlaceSelection({
    ...locationStateProps,
  })
  const { selectLocationMode } = useLocationMode({
    dismissModal,
    shouldOpenDirectlySettings: true,
    ...locationStateProps,
    ...locationSubmitProps,
  })
  const { removeSelectedVenue } = useSelectedVenueActions()
  const isCurrentLocationMode = (target: LocationMode) => tempLocationMode === target
  const theme = useTheme()

  const geolocationModeColor = isCurrentLocationMode(LocationMode.AROUND_ME)
    ? theme.colors.primary
    : theme.colors.black

  const customLocationModeColor = isCurrentLocationMode(LocationMode.AROUND_PLACE)
    ? theme.colors.primary
    : theme.colors.black

  const handleSubmit = () => {
    removeSelectedVenue()
    setTempLocationMode?.(tempLocationMode)
    onSubmit()
    if (!shouldOpenMapInTab) {
      navigate('VenueMap')
    }
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
          onSubmit={handleSubmit}
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
        {isCurrentLocationMode(LocationMode.AROUND_ME) ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={4} />
            <LocationSearchFilters
              aroundRadius={tempAroundMeRadius}
              onValuesChange={onTempAroundMeRadiusValueChange}
            />
          </React.Fragment>
        ) : null}
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
            {selectedPlace ? (
              <LocationSearchFilters
                aroundRadius={tempAroundPlaceRadius}
                onValuesChange={onTempAroundRadiusPlaceValueChange}
              />
            ) : null}
          </React.Fragment>
        ) : null}
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
