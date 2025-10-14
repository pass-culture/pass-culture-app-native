import { useFocusEffect } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { PlaylistType } from 'features/offer/enums'
import { VenueMapViewContainer } from 'features/venueMap/components/VenueMapView/VenueMapViewContainer'
import { getRegionFromPosition } from 'features/venueMap/helpers/getRegionFromPosition/getRegionFromPosition'
import { useGetVenuesInRegion } from 'features/venueMap/hook/useGetVenuesInRegion'
import { VenueMapBase } from 'features/venueMap/pages/VenueMap/VenueMapBase'
import {
  clearVenueMapStore,
  setInitialRegion,
  setOffersPlaylistType,
  setRegion,
  setVenues,
} from 'features/venueMap/store/venueMapStore'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'

export const VenueMap: FunctionComponent = () => {
  const { geolocPosition, selectedPlace, selectedLocationMode } = useLocation()
  const { width, height } = useWindowDimensions()

  const location =
    selectedLocationMode === LocationMode.AROUND_ME ? geolocPosition : selectedPlace?.geolocation

  const ratio = width / height
  const region = useMemo(() => getRegionFromPosition(location, ratio), [ratio, location])

  const venues = useGetVenuesInRegion(region)

  useFocusEffect(
    useCallback(() => {
      setInitialRegion(region)
      setRegion(region)
    }, [region])
  )

  useFocusEffect(
    useCallback(() => {
      if (venues) {
        setVenues(venues)
      }
    }, [venues])
  )

  useFocusEffect(
    useCallback(() => {
      setOffersPlaylistType(PlaylistType.TOP_OFFERS)
    }, [])
  )

  useEffect(
    () => () => {
      clearVenueMapStore()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <VenueMapBase>
      <VenueMapViewContainer />
    </VenueMapBase>
  )
}
