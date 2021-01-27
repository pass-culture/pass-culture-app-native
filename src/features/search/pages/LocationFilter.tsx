import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useRef } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { LocationType } from 'libs/algolia'
import { useGeolocation } from 'libs/geolocation'
import { _ } from 'libs/i18n'
import { Banner, BannerType } from 'ui/components/Banner'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer } from 'ui/theme'

import { LocationChoice } from '../components/LocationChoice'

import { useSearch } from './SearchWrapper'

const DEBOUNCED_CALLBACK = 500

export const LocationFilter: React.FC = () => {
  const { navigate, goBack } = useNavigation<UseNavigationType>()
  const position = useGeolocation()
  const { dispatch } = useSearch()
  const debouncedGoBack = useRef(debounce(goBack, DEBOUNCED_CALLBACK)).current

  const onPressPickPlace = () => {
    if (debouncedGoBack) debouncedGoBack.cancel()
    navigate('LocationPicker')
  }

  const onPressAroundMe = () => {
    if (position === null) {
      // TODO: implement modale to invit to active geoloc
    } else {
      dispatch({
        type: 'SET_LOCATION',
        payload: { latitude: position.latitude, longitude: position.longitude },
      })
      dispatch({ type: 'LOCATION_TYPE', payload: LocationType.AROUND_ME })
    }
    debouncedGoBack()
  }

  const onPressEverywhere = () => {
    dispatch({ type: 'LOCATION_TYPE', payload: LocationType.EVERYWHERE })
    dispatch({ type: 'SET_LOCATION', payload: null })
    debouncedGoBack()
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={14} />
      <Spacer.Column numberOfSpaces={6} />
      <Banner
        title={_(
          t`Seules les offres Sorties et Physiques seront affichées pour une recherche avec une localisation`
        )}
        type={BannerType.INFO}
      />
      <Spacer.Column numberOfSpaces={6} />
      <LocationChoice
        testID="pickPlace"
        type={LocationType.PLACE}
        arrowNext={true}
        onPress={onPressPickPlace}
      />
      <Spacer.Column numberOfSpaces={4} />
      <LocationChoice testID="aroundMe" type={LocationType.AROUND_ME} onPress={onPressAroundMe} />
      <Spacer.Column numberOfSpaces={4} />
      <LocationChoice
        testID="everywhere"
        type={LocationType.EVERYWHERE}
        onPress={onPressEverywhere}
      />
      <PageHeader title={_(t`Localisation`)} />
    </React.Fragment>
  )
}
