import React, { FC, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'

import { selectSearchOffers } from 'features/search/queries/useSearchOffersQuery/selectors/selectSearchOffers'
import { useSearchOffersQuery } from 'features/search/queries/useSearchOffersQuery/useSearchOffersQuery'
import { FetchSearchResultsArgs } from 'features/search/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { VenueMapViewContainer } from 'features/venueMap/components/VenueMapView/VenueMapViewContainer'
import { getRegionFromPosition } from 'features/venueMap/helpers/getRegionFromPosition/getRegionFromPosition'
import { isGeolocValid } from 'features/venueMap/helpers/isGeolocValid'
import {
  setInitialRegion,
  setRegion,
  setVenues,
  useVenueMapStore,
} from 'features/venueMap/store/venueMapStore'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { locationSelectors } from 'libs/locationV2/location.store'

export const SearchMapContainer: FC<{
  searchFilters: FetchSearchResultsArgs
}> = ({ searchFilters }) => {
  const transformHits = useTransformOfferHits()

  const { data: offersResponse } = useSearchOffersQuery(searchFilters, {
    select: (offersResponse) => selectSearchOffers({ data: offersResponse, transformHits }),
  })

  const initialRegion = useVenueMapStore((state) => state.initialRegion)
  const { width, height } = useWindowDimensions()

  useEffect(() => {
    const userLocation = locationSelectors.selectUserLocation()
    if (!userLocation) {
      return
    }
    const region = getRegionFromPosition(userLocation, width / height)
    if (!initialRegion) {
      setInitialRegion(region)
    }
    setRegion(region)
  }, [width, height, initialRegion])

  useEffect(() => {
    const geolocatedVenues = offersResponse?.offerVenues?.filter(
      (venue): venue is GeolocatedVenue => !!(venue.venueId && isGeolocValid(venue._geoloc))
    )

    if (geolocatedVenues?.length) {
      setVenues(geolocatedVenues)
    }
  }, [offersResponse?.offerVenues])

  return <VenueMapViewContainer />
}
