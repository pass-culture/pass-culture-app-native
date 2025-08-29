import React from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
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

  const LOCATION_BUTTON_CONTENT = {
    aroundMe: {
      title: 'Utiliser ma position actuelle',
      subtitle: hasGeolocPosition ? undefined : 'Géolocalisation désactivée',
    },
    aroundPlace: {
      title: 'Choisir une localisation',
      subtitle: LOCATION_PLACEHOLDER,
    },
    everywhere: {
      title: LocationLabel.everywhereLabel,
      subtitle: '',
    },
  }

  const listData: {
    id: string
    wrapInLi: boolean
    accessibilityLabel?: string
    component: React.JSX.Element
  }[] = []

  listData.push({
    id: 'aroundMeButton',
    wrapInLi: true,
    accessibilityLabel: [
      LOCATION_BUTTON_CONTENT.aroundMe.title,
      LOCATION_BUTTON_CONTENT.aroundMe.subtitle,
    ]
      .filter(Boolean)
      .join(', '),
    component: (
      <LocationModalButton
        onPress={selectLocationMode(LocationMode.AROUND_ME)}
        icon={PositionFilled}
        color={geolocationModeColor}
        title={LOCATION_BUTTON_CONTENT.aroundMe.title}
        subtitle={LOCATION_BUTTON_CONTENT.aroundMe.subtitle}
      />
    ),
  })

  if (shouldShowAroundMeRadiusSlider) {
    listData.push({
      id: 'aroundMeSlider',
      wrapInLi: false,
      component: (
        <SliderContainer>
          <LocationSearchFilters
            aroundRadius={tempAroundMeRadius}
            onValuesChange={onTempAroundMeRadiusValueChange}
          />
        </SliderContainer>
      ),
    })
  }

  listData.push({ id: 'separator1', wrapInLi: false, component: <StyledSeparator /> })

  listData.push({
    id: 'aroundPlaceButton',
    wrapInLi: true,
    accessibilityLabel: [
      LOCATION_BUTTON_CONTENT.aroundPlace.title,
      LOCATION_BUTTON_CONTENT.aroundPlace.subtitle,
    ]
      .filter(Boolean)
      .join(', '),
    component: (
      <LocationModalButton
        onPress={selectLocationMode(LocationMode.AROUND_PLACE)}
        icon={MagnifyingGlassFilled}
        color={customLocationModeColor}
        title={LOCATION_BUTTON_CONTENT.aroundPlace.title}
        subtitle={LOCATION_BUTTON_CONTENT.aroundPlace.subtitle}
      />
    ),
  })

  if (isCurrentLocationMode(LocationMode.AROUND_PLACE)) {
    listData.push({
      id: 'placeInput',
      wrapInLi: false,
      component: (
        <LocationSearchInput
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          placeQuery={placeQuery}
          setPlaceQuery={setPlaceQuery}
          onResetPlace={onResetPlace}
          onSetSelectedPlace={onSetSelectedPlace}
        />
      ),
    })

    if (shouldShowAroundPlaceRadiusSlider) {
      listData.push({
        id: 'aroundPlaceSlider',
        wrapInLi: false,
        component: (
          <SliderContainer>
            <LocationSearchFilters
              aroundRadius={tempAroundPlaceRadius}
              onValuesChange={onTempAroundPlaceRadiusValueChange}
            />
          </SliderContainer>
        ),
      })
    }
  }

  if (shouldDisplayEverywhereSection) {
    listData.push({
      id: 'everywhereButton',
      wrapInLi: true,
      accessibilityLabel: [
        LOCATION_BUTTON_CONTENT.everywhere.title,
        LOCATION_BUTTON_CONTENT.everywhere.subtitle,
      ]
        .filter(Boolean)
        .join(', '),
      component: (
        <StyledView>
          <Separator.Horizontal />
          <LocationModalButton
            onPress={selectLocationMode(LocationMode.EVERYWHERE)}
            icon={WorldPosition}
            color={everywhereLocationModeColor}
            title={LOCATION_BUTTON_CONTENT.everywhere.title}
          />
        </StyledView>
      ),
    })
  }

  const renderListItem = ({ item }) => {
    if (!item.wrapInLi) {
      return item.component
    }
    return (
      <Li
        accessibilityRole={AccessibilityRole.RADIOGROUP}
        accessibilityLabel={item.accessibilityLabel}>
        {item.component}
      </Li>
    )
  }

  const keyExtractor = (item) => item.id

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
      <FlatListContainer>
        <FlatList
          listAs="ul"
          data={listData}
          renderItem={renderListItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
        />
      </FlatListContainer>
    </AppModal>
  )
}

const FlatListContainer = styled.View(({ theme }) => ({
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
