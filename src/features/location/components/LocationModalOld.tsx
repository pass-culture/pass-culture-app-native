import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationModalFooter } from 'features/location/components/LocationModalFooter'
import { LOCATION_PLACEHOLDER } from 'features/location/constants'
import { LocationState } from 'features/location/types'
import { LocationLabel, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { LocationSearchFilters } from 'shared/location/LocationSearchFilters'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { PositionFilled } from 'ui/svg/icons/PositionFilled'
import { WorldPosition } from 'ui/svg/icons/WorldPosition'

type LocationModalProps = {
  visible: boolean
  onSubmit: () => void
  onClose: () => void
  onModalHideRef: LocationState['onModalHideRef']
  selectLocationMode: (mode: LocationMode) => () => void
  tempLocationMode: LocationState['tempLocationMode']
  hasGeolocPosition: LocationState['hasGeolocPosition']
  selectedPlace: LocationState['selectedPlace']
  setSelectedPlace: LocationState['setSelectedPlace']
  placeQuery: LocationState['placeQuery']
  setPlaceQuery: LocationState['setPlaceQuery']
  onSetSelectedPlace: (place: SuggestedPlace) => void
  onResetPlace: LocationState['onResetPlace']
  shouldDisplayEverywhereSection: boolean
  isSubmitDisabled: boolean
  shouldShowRadiusSlider: boolean
  buttonWording?: string
  tempAroundMeRadius?: LocationState['tempAroundMeRadius']
  onTempAroundMeRadiusValueChange?: (newValues: number[]) => void
  tempAroundPlaceRadius?: LocationState['tempAroundPlaceRadius']
  onTempAroundPlaceRadiusValueChange?: (newValues: number[]) => void
}

export const LocationModalOLD = ({
  visible,
  onSubmit,
  hasGeolocPosition,
  tempLocationMode,
  onClose,
  selectLocationMode,
  onModalHideRef,
  selectedPlace,
  tempAroundMeRadius,
  onTempAroundMeRadiusValueChange,
  setSelectedPlace,
  placeQuery,
  setPlaceQuery,
  onSetSelectedPlace,
  onResetPlace,
  tempAroundPlaceRadius,
  onTempAroundPlaceRadiusValueChange,
  shouldShowRadiusSlider,
  buttonWording,
  isSubmitDisabled,
  shouldDisplayEverywhereSection,
}: LocationModalProps) => {
  const isCurrentLocationMode = (target: LocationMode) => tempLocationMode === target

  const geolocationModeColor = isCurrentLocationMode(LocationMode.AROUND_ME)
    ? 'brandPrimary'
    : 'default'

  const customLocationModeColor = isCurrentLocationMode(LocationMode.AROUND_PLACE)
    ? 'brandPrimary'
    : 'default'

  const everywhereLocationModeColor = isCurrentLocationMode(LocationMode.EVERYWHERE)
    ? 'brandPrimary'
    : 'default'

  const shouldShowAroundPlaceRadiusSlider =
    shouldShowRadiusSlider &&
    tempAroundPlaceRadius &&
    onTempAroundPlaceRadiusValueChange &&
    selectedPlace

  const shouldShowAroundMeRadiusSlider =
    shouldShowRadiusSlider &&
    tempAroundMeRadius &&
    onTempAroundMeRadiusValueChange &&
    isCurrentLocationMode(LocationMode.AROUND_ME)

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
          isSubmitDisabled={isSubmitDisabled}
          buttonWording={buttonWording}
        />
      }>
      <StyledScrollView>
        <VerticalUl>
          <Li>
            <LocationModalButton
              onPress={selectLocationMode(LocationMode.AROUND_ME)}
              icon={PositionFilled}
              color={geolocationModeColor}
              title="Utiliser ma position actuelle"
              subtitle={hasGeolocPosition ? undefined : 'Géolocalisation désactivée'}
            />
            {shouldShowAroundMeRadiusSlider ? (
              <SliderContainer>
                <LocationSearchFilters
                  aroundRadius={tempAroundMeRadius}
                  onValuesChange={onTempAroundMeRadiusValueChange}
                />
              </SliderContainer>
            ) : null}
            <StyledSeparator />
          </Li>
          <Li>
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
                  onSetSelectedPlace={onSetSelectedPlace}
                />
                {shouldShowAroundPlaceRadiusSlider ? (
                  <SliderContainer>
                    <LocationSearchFilters
                      aroundRadius={tempAroundPlaceRadius}
                      onValuesChange={onTempAroundPlaceRadiusValueChange}
                    />
                  </SliderContainer>
                ) : null}
              </React.Fragment>
            ) : null}
          </Li>
          {shouldDisplayEverywhereSection ? (
            <Li>
              <StyledView>
                <Separator.Horizontal />
                <LocationModalButton
                  onPress={selectLocationMode(LocationMode.EVERYWHERE)}
                  icon={WorldPosition}
                  color={everywhereLocationModeColor}
                  title={LocationLabel.everywhereLabel}
                />
              </StyledView>
            </Li>
          ) : null}
        </VerticalUl>
      </StyledScrollView>
    </AppModal>
  )
}

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  marginTop: theme.designSystem.size.spacing.xl,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.l,
  width: '100%',
}))

const StyledView = styled(View)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  gap: theme.designSystem.size.spacing.xl,
}))

const SliderContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))
