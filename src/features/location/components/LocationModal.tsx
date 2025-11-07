import React from 'react'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationModalFooter } from 'features/location/components/LocationModalFooter'
import { LOCATION_PLACEHOLDER } from 'features/location/constants'
import { LocationState } from 'features/location/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
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

export const LocationModal = ({
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

  const buildAccessibilityLabel = (
    title: string,
    subtitle: string | undefined,
    isSelected: boolean
  ) => {
    return `${title}${subtitle ? `, ${subtitle}` : ''}, ${isSelected ? 'sélectionné' : 'non sélectionné'}`
  }

  const AROUND_ME_TITLE = 'Utiliser ma position actuelle'
  const AROUND_ME_SUBTITLE = hasGeolocPosition ? undefined : 'Géolocalisation désactivée'
  const accessibilityLabelAroundMe = buildAccessibilityLabel(
    AROUND_ME_TITLE,
    AROUND_ME_SUBTITLE,
    isCurrentLocationMode(LocationMode.AROUND_ME)
  )

  const AROUND_PLACE_TITLE = 'Choisir une localisation'
  const accessibilityLabelAroundPlace = buildAccessibilityLabel(
    AROUND_PLACE_TITLE,
    LOCATION_PLACEHOLDER,
    isCurrentLocationMode(LocationMode.AROUND_PLACE)
  )

  const accessibilityLabelEverywhere = buildAccessibilityLabel(
    LocationLabel.everywhereLabel,
    undefined,
    isCurrentLocationMode(LocationMode.EVERYWHERE)
  )

  const groupLabel = 'Localisation'

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
            title={groupLabel}
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
          <Li
            groupLabel={groupLabel}
            accessibilityLabel={accessibilityLabelAroundMe}
            accessibilityRole={AccessibilityRole.BUTTON}
            index={0}
            total={3}>
            <LocationModalButton
              onPress={selectLocationMode(LocationMode.AROUND_ME)}
              icon={PositionFilled}
              color={geolocationModeColor}
              title={AROUND_ME_TITLE}
              subtitle={AROUND_ME_SUBTITLE}
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
          <Li
            groupLabel={groupLabel}
            accessibilityLabel={accessibilityLabelAroundPlace}
            accessibilityRole={AccessibilityRole.BUTTON}
            index={1}
            total={3}>
            <LocationModalButton
              onPress={selectLocationMode(LocationMode.AROUND_PLACE)}
              icon={MagnifyingGlassFilled}
              color={customLocationModeColor}
              title={AROUND_PLACE_TITLE}
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
            <StyledSeparator />
          </Li>
          {shouldDisplayEverywhereSection ? (
            <Li
              groupLabel={groupLabel}
              accessibilityLabel={accessibilityLabelEverywhere}
              accessibilityRole={AccessibilityRole.BUTTON}
              index={2}
              total={3}>
              <LocationModalButton
                onPress={selectLocationMode(LocationMode.EVERYWHERE)}
                icon={WorldPosition}
                color={everywhereLocationModeColor}
                title={LocationLabel.everywhereLabel}
              />
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

const SliderContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
