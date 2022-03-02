import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useRef } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { LocationChoice } from 'features/search/components/LocationChoice'
import { LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { Banner } from 'ui/components/Banner'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { getSpacing, Spacer } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

const DEBOUNCED_CALLBACK = 500

export const LocationFilter: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const { goBack } = useGoBack(...getTabNavConfig('Search'))
  const {
    position,
    positionError,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useGeolocation()
  const { dispatch } = useStagedSearch()
  const debouncedGoBack = useRef(debounce(goBack, DEBOUNCED_CALLBACK)).current

  const onPressPickPlace = () => {
    if (debouncedGoBack) debouncedGoBack.cancel()
    navigate('LocationPicker')
  }

  const onPressAroundMe = async () => {
    if (position === null) {
      if (permissionState === GeolocPermissionState.GRANTED) {
        return
      }
      if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
        showGeolocPermissionModal()
      } else {
        await requestGeolocPermission()
        debouncedGoBack()
      }
    } else {
      dispatch({ type: 'SET_LOCATION_AROUND_ME' })
      debouncedGoBack()
    }
  }

  const onPressEverywhere = () => {
    dispatch({ type: 'SET_LOCATION_EVERYWHERE' })
    debouncedGoBack()
  }
  const locationChoiceErrorId = uuidv4()

  return (
    <Container>
      <PageHeader title={t`Localisation`} />
      <Spacer.TopScreen />
      <ScrollView contentContainerStyle={contentContainerStyle}>
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
            />
            <Spacer.Column numberOfSpaces={6} />
          </Li>
          <Li>
            <LocationChoice
              testID="aroundMe"
              section={LocationType.AROUND_ME}
              onPress={onPressAroundMe}
              accessibilityDescribedBy={locationChoiceErrorId}
            />
            {!!positionError && (
              <InputError
                visible
                messageId={positionError.message}
                numberOfSpacesTop={1}
                relatedInputId={locationChoiceErrorId}
              />
            )}
            <Spacer.Column numberOfSpaces={6} />
          </Li>
          <Li>
            <LocationChoice
              testID="everywhere"
              section={LocationType.EVERYWHERE}
              onPress={onPressEverywhere}
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
