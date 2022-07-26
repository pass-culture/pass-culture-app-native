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
import { getSpacing, Spacer } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

export const LocationFilter: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const [areButtonsDisabled, setButtonsDisabled] = useState(false)

  const { goBack } = useGoBack(...getTabNavConfig('Search'))
  const {
    position,
    positionError,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useGeolocation()
  const { dispatch } = useStagedSearch()

  const onPressPickPlace = () => {
    setButtonsDisabled(true)
    navigate('LocationPicker')
    setButtonsDisabled(false)
  }

  const onPressAroundMe = async () => {
    if (position === null) {
      if (permissionState === GeolocPermissionState.GRANTED) {
        return
      }
      if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
        showGeolocPermissionModal()
      } else {
        setButtonsDisabled(true)
        await requestGeolocPermission()
        goBack()
      }
    } else {
      setButtonsDisabled(true)
      dispatch({ type: 'SET_LOCATION_AROUND_ME' })
      goBack()
      analytics.logChangeSearchLocation({ type: 'aroundMe' })
    }
  }

  const onPressEverywhere = () => {
    setButtonsDisabled(true)
    dispatch({ type: 'SET_LOCATION_EVERYWHERE' })
    goBack()
    analytics.logChangeSearchLocation({ type: 'everywhere' })
  }

  const locationChoiceErrorId = uuidv4()
  const titleID = uuidv4()

  return (
    <Container>
      <PageHeader titleID={titleID} title={t`Localisation`} />
      <Spacer.TopScreen />
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        accessibilityRole={AccessibilityRole.RADIOGROUP}
        aria-labelledby={titleID}>
        <Spacer.Column numberOfSpaces={14} />
        <Spacer.Column numberOfSpaces={6} />
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
              section={LocationType.PLACE}
              arrowNext={true}
              onPress={onPressPickPlace}
              disabled={areButtonsDisabled}
            />
            <Spacer.Column numberOfSpaces={6} />
          </Li>
          <Li>
            <LocationChoice
              testID="aroundMe"
              section={LocationType.AROUND_ME}
              onPress={onPressAroundMe}
              disabled={areButtonsDisabled}
              accessibilityDescribedBy={locationChoiceErrorId}
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
              section={LocationType.EVERYWHERE}
              onPress={onPressEverywhere}
              disabled={areButtonsDisabled}
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
