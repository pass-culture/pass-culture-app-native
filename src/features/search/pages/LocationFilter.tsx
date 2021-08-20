import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useRef } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { LocationChoice } from 'features/search/components/LocationChoice'
import { LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { Banner } from 'ui/components/Banner'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { getSpacing, Spacer } from 'ui/theme'

const DEBOUNCED_CALLBACK = 500

export const LocationFilter: React.FC = () => {
  const { navigate, goBack } = useNavigation<UseNavigationType>()
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
      dispatch({
        type: 'LOCATION_AROUND_ME',
        payload: { latitude: position.latitude, longitude: position.longitude },
      })
      debouncedGoBack()
    }
  }

  const onPressEverywhere = () => {
    dispatch({ type: 'LOCATION_EVERYWHERE' })
    debouncedGoBack()
  }

  return (
    <React.Fragment>
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
        <LocationChoice
          testID="pickPlace"
          locationType={LocationType.PLACE}
          arrowNext={true}
          onPress={onPressPickPlace}
        />
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          testID="aroundMe"
          locationType={LocationType.AROUND_ME}
          onPress={onPressAroundMe}
        />
        {!!positionError && (
          <InputError visible messageId={positionError.message} numberOfSpacesTop={1} />
        )}
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          testID="everywhere"
          locationType={LocationType.EVERYWHERE}
          onPress={onPressEverywhere}
        />
      </ScrollView>
      <PageHeader title={t`Localisation`} />
    </React.Fragment>
  )
}

const contentContainerStyle: ViewStyle = {
  flexGrow: 1,
  paddingLeft: getSpacing(2),
}

const BannerContainer = styled.View({ marginHorizontal: getSpacing(6) })
