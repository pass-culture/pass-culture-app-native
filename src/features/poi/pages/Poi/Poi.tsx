import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
// import { usePoi } from 'features/poi/api/usePoi'
import { PoiContent } from 'features/poi/components/PoiContent/PoiContent'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'

export const Poi: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Poi'>>()
  const { data: poi } = useVenue(params.id)
  const { data: poiOffers } = useVenueOffers(poi)

  if (!poi) return null

  return <PoiContent poi={poi} poiOffers={poiOffers} />
}
