import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FC } from 'react'

import { LocationModal } from 'features/location/components/LocationModal'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { removeSelectedVenue } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'

export const VenueMapLocationModal: FC = () => {
  const {
    params: { openedFrom, shouldOpenMapInTab },
  } = useRoute<UseRouteType<'VenueMapLocationModal'>>()

  const { replace } = useNavigation<UseNavigationType>()

  const handleSubmit = () => {
    removeSelectedVenue()
    if (!shouldOpenMapInTab) {
      void analytics.logConsultVenueMap({ from: openedFrom })
      replace('VenueMap')
    }
  }

  return (
    <LocationModal
      from="venueMap"
      onSubmit={handleSubmit}
      buttonWording="Valider et voir sur la carte"
      shouldHideEverywhereSection
    />
  )
}
