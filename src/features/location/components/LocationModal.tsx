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

  const listData: { id: string; component: React.JSX.Element }[] = []

  // 1. "Around Me" Button
  listData.push({
    id: 'aroundMeButton',
    component: (
      <Li
        key="aroundMeButton"
        accessibilityRole={AccessibilityRole.RADIOGROUP}
        accessibilityLabelledBy="Utiliser ma position actuelle">
        <LocationModalButton
          onPress={selectLocationMode(LocationMode.AROUND_ME)}
          icon={PositionFilled}
          color={geolocationModeColor}
          title="Utiliser ma position actuelle"
          subtitle={hasGeolocPosition ? undefined : 'Géolocalisation désactivée'}
        />
      </Li>
    ),
  })

  // 2. "Around Me" Radius Slider (Conditional)
  if (shouldShowAroundMeRadiusSlider) {
    listData.push({
      id: 'aroundMeSlider',
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

  // 3. Separator
  listData.push({
    id: 'separator1',
    component: <StyledSeparator />,
  })

  // 4. "Around Place" Button
  listData.push({
    id: 'aroundPlaceButton',
    component: (
      <LocationModalButton
        onPress={selectLocationMode(LocationMode.AROUND_PLACE)}
        icon={MagnifyingGlassFilled}
        color={customLocationModeColor}
        title="Choisir une localisation"
        subtitle={LOCATION_PLACEHOLDER}
      />
    ),
  })

  // 5. "Around Place" Input and Slider (Conditional)
  if (isCurrentLocationMode(LocationMode.AROUND_PLACE)) {
    listData.push({
      id: 'placeInput',
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

  // 6. "Everywhere" Section (Conditional)
  if (shouldDisplayEverywhereSection) {
    listData.push({
      id: 'everywhereSection',
      component: (
        <StyledView>
          <Separator.Horizontal />
          <LocationModalButton
            onPress={selectLocationMode(LocationMode.EVERYWHERE)}
            icon={WorldPosition}
            color={everywhereLocationModeColor}
            title={LocationLabel.everywhereLabel}
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

  // A function to extract the unique ID for each item
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
      {/* <StyledScrollView>
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
        {shouldDisplayEverywhereSection ? (
          <StyledView>
            <Separator.Horizontal />
            <LocationModalButton
              onPress={selectLocationMode(LocationMode.EVERYWHERE)}
              icon={WorldPosition}
              color={everywhereLocationModeColor}
              title={LocationLabel.everywhereLabel}
            />
          </StyledView>
        ) : null}
      </StyledScrollView> */}

      <FlatListContainer>
        <FlatList
          listAs="ul"
          data={listData}
          renderItem={renderListItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false} // A common prop to add
          // If your StyledScrollView had specific styling for the content, use contentContainerStyle
          // contentContainerStyle={{ padding: 16 }}
        />
      </FlatListContainer>
    </AppModal>
  )
}

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  marginTop: theme.designSystem.size.spacing.xl,
}))
const FlatListContainer = styled.View(({ theme }) => ({
  flex: 1,
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
