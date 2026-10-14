import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { PlaylistType } from 'features/offer/enums'
import { getRegionFromPosition } from 'features/venueMap/helpers/getRegionFromPosition/getRegionFromPosition'
import { useGetVenuesInRegion } from 'features/venueMap/hook/useGetVenuesInRegion'
import {
  clearVenueMapStore,
  setInitialRegion,
  setOffersPlaylistType,
  setRegion,
  setVenues,
} from 'features/venueMap/store/venueMapStore'
import { LocationMode } from 'libs/location/types'
import { useLocationConfiguration, useLocationMode, usePlace } from 'libs/locationV2/location.store'

/** Feeds the venue map store the way the `VenueMap` page does, for the map tab. */
export const useInitGeneralPublicMap = () => {
  const { geolocation: geolocPosition } = useLocationConfiguration(LocationMode.AROUND_ME)
  const selectedPlace = usePlace()
  const selectedLocationMode = useLocationMode()
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

  useEffect(function clearVenueMapStoreOnUnmount() {
    return clearVenueMapStore
  }, [])
}
