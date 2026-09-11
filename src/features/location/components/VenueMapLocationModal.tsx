import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FC } from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { removeSelectedVenue } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'

export const VenueMapLocationModal: FC = () => {
  const {
    params: { openedFrom, shouldOpenMapInTab },
  } = useRoute<UseRouteType<'VenueMapLocationModal'>>()

  const { replace, popTo, goBack } = useNavigation<UseNavigationType>()

  const { searchState } = useSearch()

  const handleSubmit = () => {
    removeSelectedVenue()

    if (openedFrom === 'search') {
      void analytics.logConsultVenueMap({
        from: 'search',
        searchId: searchState.searchId,
      })
      popTo('TabNavigator', {
        screen: 'SearchStackNavigator',
        params: { screen: 'SearchMap', params: searchState },
      })
      return
    }

    if (!shouldOpenMapInTab) {
      void analytics.logConsultVenueMap({ from: openedFrom })
      replace('VenueMap')
      return
    }

    goBack()
  }

  return (
    <LocationModal
      from="venueMap"
      onSubmit={handleSubmit}
      shouldShowRadiusSlider
      buttonWording="Valider et voir sur la carte"
      shouldHideEverywhereSection
    />
  )
}
