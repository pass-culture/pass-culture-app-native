import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { LocationChoice } from 'features/search/components/LocationChoice'
import { LocationType } from 'features/search/enums'
import { Action } from 'features/search/pages/reducer'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { LocationFilter as LocationFilterType } from 'features/search/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/firebase/analytics'
import { ChangeSearchLocationParam } from 'libs/firebase/analytics/analytics'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorAroundMe as AroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { BicolorLocationBuilding as LocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { Spacer } from 'ui/theme'

export const LocationFilter: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const [areButtonsDisabled, setButtonsDisabled] = useState(false)

  const { params } = useRoute<UseRouteType<'LocationFilter'>>()

  const { searchState } = useSearch()
  const { dispatch: dispatchStagedSearch } = useStagedSearch()
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

  useEffect(() => {
    if (params?.selectedVenue) {
      setSelectedFilter({ locationType: LocationType.VENUE, venue: params.selectedVenue })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.selectedVenue?.venueId])

  useEffect(() => {
    if (params?.selectedPlace) {
      setSelectedFilter({
        locationType: LocationType.PLACE,
        place: params.selectedPlace,
        aroundRadius: MAX_RADIUS,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.selectedPlace?.label])

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

  const onResetPress = () => {
    if (position !== null) {
      setSelectedFilter({ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS })
    } else {
      setSelectedFilter({ locationType: LocationType.EVERYWHERE })
    }
  }

  const onSearchPress = () => {
    let toDispatch: Action
    let toSendToAnalytics: ChangeSearchLocationParam
    switch (selectedFilter.locationType) {
      case LocationType.EVERYWHERE:
        toDispatch = { type: 'SET_LOCATION_EVERYWHERE' }
        toSendToAnalytics = { type: 'everywhere' }
        break
      case LocationType.AROUND_ME:
        toDispatch = { type: 'SET_LOCATION_AROUND_ME' }
        toSendToAnalytics = { type: 'aroundMe' }
        break
      case LocationType.PLACE:
        toDispatch = {
          type: 'SET_LOCATION_PLACE',
          payload: { aroundRadius: selectedFilter.aroundRadius, place: selectedFilter.place },
        }
        toSendToAnalytics = { type: 'place' }
        break
      case LocationType.VENUE:
        toDispatch = {
          type: 'SET_LOCATION_VENUE',
          payload: { ...selectedFilter.venue },
        }
        toSendToAnalytics = { type: 'venue', venueId: selectedFilter.venue.venueId }
        break
    }

    dispatchStagedSearch(toDispatch)
    analytics.logChangeSearchLocation(toSendToAnalytics)
    navigate(
      ...getTabNavConfig('Search', {
        ...searchState,
        locationFilter: selectedFilter,
      })
    )
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
      <PageHeader titleID={titleID} title="Localisation" background="primary" withGoBackButton />
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        accessibilityRole={AccessibilityRole.RADIOGROUP}
        aria-labelledby={titleID}>
        <Spacer.Column numberOfSpaces={8} />
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
              label="Autour de moi"
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
              label="Partout"
              Icon={Everywhere}
            />
          </Li>
        </VerticalUl>
      </ScrollView>
      <FilterPageButtons onResetPress={onResetPress} onSearchPress={onSearchPress} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const contentContainerStyle: ViewStyle = { flexGrow: 1 }
