import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { LocationChoice } from 'features/search/components/LocationChoice'
import { LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { Banner } from 'ui/components/Banner'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorAroundMe as AroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { BicolorLocationBuilding as LocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { getSpacing, Spacer } from 'ui/theme'

export const LocationFilter: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const [areButtonsDisabled, setButtonsDisabled] = useState(false)

  const { searchState, dispatch } = useSearch()
  const [selectedFilter, setSelectedFilter] = useState<LocationFilterType>(
    searchState.locationFilter
  )

  const {
    position,
    positionError,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useGeolocation()


  const onPressPickPlace = () => {
    setButtonsDisabled(true)
    navigate('LocationPicker')
    setButtonsDisabled(false)
  }

  const onPressAroundMe = async () => {
    const grantedButUnknownPosition =
      position === null && permissionState === GeolocPermissionState.GRANTED
    if (grantedButUnknownPosition) {
      return
    }
    if (position === null) {
      if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
        showGeolocPermissionModal()
      } else {
        setButtonsDisabled(true)
        await requestGeolocPermission()
        setButtonsDisabled(false)
        setSelectedFilter({ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS })
      }
    } else {
      setSelectedFilter({ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS })
    }
  }

  const onPressEverywhere = () => {
    setSelectedFilter({ locationType: LocationType.EVERYWHERE })
  }
  }

  const VenueOrPlaceLabel =
    selectedFilter.locationType === LocationType.VENUE
      ? selectedFilter.venue.label
      : selectedFilter.locationType === LocationType.PLACE
      ? selectedFilter.place.label
      : 'Choisir un lieu'

  const VenueOrPlaceIcon =
    selectedFilter.locationType === LocationType.VENUE ? LocationBuilding : LocationPointer

  const locationChoiceErrorId = uuidv4()
  const titleID = uuidv4()

  return (
    <Container>
      <PageHeader titleID={titleID} title={t`Localisation`} background="primary" withGoBackButton />
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        accessibilityRole={AccessibilityRole.RADIOGROUP}
        aria-labelledby={titleID}>
        <Spacer.Column numberOfSpaces={8} />
        <BannerContainer>
          <Banner
            title={t`Seules les sorties et offres physiques seront affichées pour une recherche avec une localisation`}
          />
        </BannerContainer>
        <Spacer.Column numberOfSpaces={6} />
        <VerticalUl>
          <Li>
            <LocationChoice
              testID="pickPlace"
              arrowNext={true}
              onPress={onPressPickPlace}
              disabled={areButtonsDisabled}
              isSelected={
                selectedFilter.locationType === LocationType.PLACE ||
                selectedFilter.locationType === LocationType.VENUE
              }
              label={VenueOrPlaceLabel}
              Icon={VenueOrPlaceIcon}
            />
            <Spacer.Column numberOfSpaces={6} />
          </Li>
          <Li>
            <LocationChoice
              testID="aroundMe"
              onPress={onPressAroundMe}
              disabled={areButtonsDisabled}
              accessibilityDescribedBy={locationChoiceErrorId}
              isSelected={selectedFilter.locationType === LocationType.AROUND_ME}
              label={'Autour de moi'}
              Icon={AroundMe}
            />
            <InputError
              visible={!!positionError}
              messageId={positionError?.message}
              numberOfSpacesTop={1}
              relatedInputId={locationChoiceErrorId}
            />
            <Spacer.Column numberOfSpaces={6} />
          </Li>
          <Li>
            <LocationChoice
              testID="everywhere"
              onPress={onPressEverywhere}
              disabled={areButtonsDisabled}
              isSelected={selectedFilter.locationType === LocationType.EVERYWHERE}
              label={'Partout'}
              Icon={Everywhere}
            />
          </Li>
        </VerticalUl>
      </ScrollView>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const contentContainerStyle: ViewStyle = { flexGrow: 1 }

const BannerContainer = styled.View({ marginHorizontal: getSpacing(6) })
