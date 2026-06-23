import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { LocationModalFooter } from 'features/location/components/LocationModalFooter'
import { ModalScreenWrapper } from 'features/location/components/ModalScreenWrapper'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { LocationLabel, LocationMode } from 'libs/location/types'
import { useIsGeolocated } from 'libs/locationV2/location.store'
import { locationModalActions, locationModalStore } from 'libs/locationV2/locationModal.store'
import { requestGeolocPermission } from 'libs/locationV2/requestGeolocPermission'
import { LocationSearchFilters } from 'shared/location/LocationSearchFilters'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { PositionFilled } from 'ui/svg/icons/PositionFilled'
import { WorldPosition } from 'ui/svg/icons/WorldPosition'
import { Spacer } from 'ui/theme'

type LocationModalProps = {
  onSubmit?: () => void
  onClose?: () => void
  shouldHideEverywhereSection?: boolean
  shouldShowRadiusSlider?: boolean
  buttonWording?: string
  from: 'home' | 'search' | 'venueMap'
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
  onSubmit,
  onClose,
  shouldShowRadiusSlider,
  buttonWording,
  shouldHideEverywhereSection,
  from,
}: LocationModalProps) => {
  const locationMode = locationModalStore.hooks.useLocationMode()
  const selectedPlace = locationModalStore.hooks.usePlace()
  const isSubmitDisabled = locationModalStore.hooks.useIsSubmitDisabled()
  const addressInputValue = locationModalStore.hooks.useAddressInputValue()
  const { radius: aroundMeRadius } = locationModalStore.hooks.useConfiguration(
    LocationMode.AROUND_ME
  )
  const { radius: aroundPlaceRadius } = locationModalStore.hooks.useConfiguration(
    LocationMode.AROUND_PLACE
  )
  const isGeolocated = useIsGeolocated()
  const { goBack } = useNavigation<UseNavigationType>()

  const isCurrentLocationMode = (target: LocationMode) => locationMode === target

  const onTempAroundPlaceRadiusValueChange = (newValues: number[]) => {
    if (newValues?.[0]) {
      locationModalActions.setAroundPlaceRadius(newValues[0])
    }
  }

  const onTempAroundMeRadiusValueChange = (newValues: number[]) => {
    if (newValues?.[0]) {
      locationModalActions.setAroundMeRadius(newValues[0])
    }
  }

  useEffect(() => {
    locationModalActions.sync()
  }, [])

  const handleSubmit = () => {
    locationModalActions.submit()
    void analytics.logUserSetLocation(from)
    onSubmit?.()
    goBack()
  }

  const handleClose = () => {
    onClose?.()
    goBack()
  }

  const shouldShowAroundPlaceRadiusSlider =
    shouldShowRadiusSlider && isCurrentLocationMode(LocationMode.AROUND_PLACE)

  const shouldShowAroundMeRadiusSlider =
    shouldShowRadiusSlider && isCurrentLocationMode(LocationMode.AROUND_ME)

  const groupLabel = 'Sélectionne ta localisation'

  const options: RadioButtonGroupOption[] = [
    {
      key: LocationMode.AROUND_ME,
      label: AROUND_ME_TITLE,
      description: isGeolocated ? undefined : 'Géolocalisation désactivée',
      asset: { variant: 'icon', Icon: PositionFilled },
      collapsed: shouldShowAroundMeRadiusSlider ? (
        <SliderContainer>
          <LocationSearchFilters
            aroundRadius={aroundMeRadius}
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
        locationMode === LocationMode.AROUND_PLACE ? (
          <React.Fragment>
            <LocationSearchInput
              selectedPlace={selectedPlace}
              setSelectedPlace={locationModalActions.setPlace}
              placeQuery={addressInputValue}
              setPlaceQuery={locationModalActions.setAddressInputValue}
              onResetPlace={locationModalActions.resetPlace}
            />
            {shouldShowAroundPlaceRadiusSlider ? (
              <SliderContainer>
                <LocationSearchFilters
                  aroundRadius={aroundPlaceRadius}
                  onValuesChange={onTempAroundPlaceRadiusValueChange}
                />
              </SliderContainer>
            ) : null}
          </React.Fragment>
        ) : null,
    },
    ...(shouldHideEverywhereSection
      ? []
      : [
          {
            key: LocationMode.EVERYWHERE,
            label: LocationLabel.everywhereLabel,
            asset: { variant: 'icon' as const, Icon: WorldPosition },
          },
        ]),
  ]

  const currentValue = locationMode ? MODE_TO_LABEL_MAP[locationMode] : ''

  return (
    <ModalScreenWrapper onClose={handleClose}>
      {(closeWithTransition) => (
        <React.Fragment>
          <HeaderContainer>
            <ModalHeader
              title="Localisation"
              rightIconAccessibilityLabel="Fermer la modale"
              rightIcon={Close}
              onRightIconPress={closeWithTransition}
            />
          </HeaderContainer>
          <StyledScrollView keyboardShouldPersistTaps="handled">
            <RadioButtonGroup
              label={groupLabel}
              options={options}
              value={currentValue}
              onChange={handleChange}
              variant="detailed"
            />
          </StyledScrollView>
          <FooterContainer>
            <LocationModalFooter
              onSubmit={handleSubmit}
              isSubmitDisabled={isSubmitDisabled}
              buttonWording={buttonWording}
            />
          </FooterContainer>
          <Spacer.BottomScreen />
        </React.Fragment>
      )}
    </ModalScreenWrapper>
  )
}

const handleChange = async (label: string) => {
  const mode = LABEL_TO_MODE_MAP[label]
  if (mode) {
    if (mode === LocationMode.AROUND_ME) {
      await requestGeolocPermission({
        onSuccess: () => locationModalActions.setLocationMode(LocationMode.AROUND_ME),
      })
    } else {
      locationModalActions.setLocationMode(mode)
    }
  }
}

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  flex: 1,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  marginTop: theme.designSystem.size.spacing.xl,
}))

const FooterContainer = styled.View(({ theme }) => ({
  paddingBottom: theme.modal.spacing.LG,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.l,
  width: '100%',
}))

const SliderContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
