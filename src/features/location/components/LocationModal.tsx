import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { LocationModalFooter } from 'features/location/components/LocationModalFooter'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { LocationLabel, LocationMode } from 'libs/location/types'
import { useIsGeolocated } from 'libs/locationV2/location.store'
import { locationModalActions, locationModalStore } from 'libs/locationV2/locationModal.store'
import { requestGeolocPermission } from 'libs/locationV2/requestGeolocPermission'
import { LocationSearchFilters } from 'shared/location/LocationSearchFilters'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { ModalScreenWrapper } from 'shared/ModalScreenWrapper/ModalScreenWrapper'
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
    if (onSubmit) {
      onSubmit()
      return
    }
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

  const currentValue = locationMode ?? ''

  return (
    <ModalScreenWrapper onClose={handleClose} fullScreen title="Localisation">
      {(closeWithTransition, titleId) => (
        <React.Fragment>
          <HeaderContainer>
            <ModalHeader
              title="Localisation"
              titleID={titleId}
              rightIconAccessibilityLabel="Fermer la modale"
              rightIcon={Close}
              onRightIconPress={closeWithTransition}
            />
          </HeaderContainer>
          <StyledScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
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

const handleChange = async (mode: string) => {
  if (mode === LocationMode.AROUND_ME) {
    await requestGeolocPermission({
      onSuccess: () => locationModalActions.setLocationMode(LocationMode.AROUND_ME),
    })
    return
  }
  if (mode === LocationMode.AROUND_PLACE || mode === LocationMode.EVERYWHERE) {
    locationModalActions.setLocationMode(mode)
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
