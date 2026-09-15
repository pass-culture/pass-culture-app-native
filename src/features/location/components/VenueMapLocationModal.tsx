import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FC } from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { removeSelectedVenue } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'

export const VenueMapLocationModal: FC = () => {
  const {
    params: { openedFrom },
  } = useRoute<UseRouteType<'VenueMapLocationModal'>>()

  const { replace, popTo } = useNavigation<UseNavigationType>()

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

    void analytics.logConsultVenueMap({ from: openedFrom })
    replace('VenueMap')
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
