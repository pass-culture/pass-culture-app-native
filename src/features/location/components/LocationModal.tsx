import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { LocationModalFooter } from 'features/location/components/LocationModalFooter'
import { LocationState } from 'features/location/types'
import { LocationLabel, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { LocationSearchFilters } from 'shared/location/LocationSearchFilters'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'
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

const AROUND_ME_TITLE = 'Utiliser ma position actuelle'
const AROUND_PLACE_TITLE = 'Choisir une zone géographique'
const AROUND_PLACE_SUBTITLE = 'Ville, code postal, adresse'

const LABEL_TO_MODE_MAP: Record<string, LocationMode> = {
  [AROUND_ME_TITLE]: LocationMode.AROUND_ME,
  [AROUND_PLACE_TITLE]: LocationMode.AROUND_PLACE,
  [LocationLabel.everywhereLabel]: LocationMode.EVERYWHERE,
}

const MODE_TO_LABEL_MAP: Record<LocationMode, string> = {
  [LocationMode.AROUND_ME]: AROUND_ME_TITLE,
  [LocationMode.AROUND_PLACE]: AROUND_PLACE_TITLE,
  [LocationMode.EVERYWHERE]: LocationLabel.everywhereLabel,
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

  const groupLabel = 'Sélectionne ta localisation'

  const options: RadioButtonGroupOption[] = useMemo(() => {
    const baseOptions: RadioButtonGroupOption[] = [
      {
        key: LocationMode.AROUND_ME,
        label: AROUND_ME_TITLE,
        description: hasGeolocPosition ? undefined : 'Géolocalisation désactivée',
        asset: { variant: 'icon', Icon: PositionFilled },
        collapsed: shouldShowAroundMeRadiusSlider ? (
          <SliderContainer>
            <LocationSearchFilters
              aroundRadius={tempAroundMeRadius}
              onValuesChange={onTempAroundMeRadiusValueChange}
            />
          </SliderContainer>
        ) : null,
      },
      {
        key: LocationMode.AROUND_PLACE,
        label: AROUND_PLACE_TITLE,
        description: AROUND_PLACE_SUBTITLE,
        asset: { variant: 'icon', Icon: MagnifyingGlassFilled },
        collapsed:
          tempLocationMode === LocationMode.AROUND_PLACE ? (
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
          ) : null,
      },
    ]

    if (shouldDisplayEverywhereSection) {
      baseOptions.push({
        key: LocationMode.EVERYWHERE,
        label: LocationLabel.everywhereLabel,
        asset: { variant: 'icon', Icon: WorldPosition },
      })
    }

    return baseOptions
  }, [
    hasGeolocPosition,
    shouldShowAroundMeRadiusSlider,
    tempAroundMeRadius,
    onTempAroundMeRadiusValueChange,
    tempLocationMode,
    selectedPlace,
    setSelectedPlace,
    placeQuery,
    setPlaceQuery,
    onResetPlace,
    onSetSelectedPlace,
    shouldShowAroundPlaceRadiusSlider,
    tempAroundPlaceRadius,
    onTempAroundPlaceRadiusValueChange,
    shouldDisplayEverywhereSection,
  ])

  const currentValue = tempLocationMode ? MODE_TO_LABEL_MAP[tempLocationMode] : ''

  const handleChange = (label: string) => {
    const mode = LABEL_TO_MODE_MAP[label]
    if (mode) {
      selectLocationMode(mode)()
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
          onSubmit={() => onSubmit()}
          isSubmitDisabled={isSubmitDisabled}
          buttonWording={buttonWording}
        />
      }>
      <StyledScrollView>
        <RadioButtonGroup
          label={groupLabel}
          options={options}
          value={currentValue}
          onChange={handleChange}
          variant="detailed"
        />
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
