import { t } from '@lingui/macro'
import debounce from 'lodash.debounce'
import React, { useRef } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { LocationChoice } from 'features/search/components/LocationChoice'
import { LocationType, SearchView } from 'features/search/enums'
import { useSearchView, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { Banner } from 'ui/components/Banner'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { getSpacing, Spacer } from 'ui/theme'

const DEBOUNCED_CALLBACK = 500

export const LocationFilter: React.FC = () => {
  const { setSearchView } = useSearchView()
  const {
    position,
    positionError,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useGeolocation()
  const { dispatch } = useStagedSearch()
  const debouncedSetSearchView = useRef(debounce(setSearchView, DEBOUNCED_CALLBACK)).current

  const onPressPickPlace = () => {
    if (debouncedSetSearchView) debouncedSetSearchView.cancel()
    setSearchView(SearchView.LOCATION_ADDRESS)
  }

  const onPressAroundMe = async () => {
    if (position === null) {
      if (permissionState === GeolocPermissionState.GRANTED) {
        return
      }
      if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
        showGeolocPermissionModal()
        return
      } else {
        await requestGeolocPermission()
      }
    } else {
      dispatch({ type: 'SET_LOCATION_AROUND_ME' })
    }
    debouncedSetSearchView(SearchView.LANDING)
  }

  const onPressEverywhere = () => {
    dispatch({ type: 'SET_LOCATION_EVERYWHERE' })
    debouncedSetSearchView(SearchView.LANDING)
  }

  return (
    <Container>
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
          section={LocationType.PLACE}
          arrowNext={true}
          onPress={onPressPickPlace}
        />
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          testID="aroundMe"
          section={LocationType.AROUND_ME}
          onPress={onPressAroundMe}
        />
        {!!positionError && (
          <InputError visible messageId={positionError.message} numberOfSpacesTop={1} />
        )}
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          testID="everywhere"
          section={LocationType.EVERYWHERE}
          onPress={onPressEverywhere}
        />
      </ScrollView>
      <PageHeader title={t`Localisation`} onGoBack={() => setSearchView(SearchView.LANDING)} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const contentContainerStyle: ViewStyle = {
  flexGrow: 1,
  paddingLeft: getSpacing(2),
}

const BannerContainer = styled.View({ marginHorizontal: getSpacing(6) })
