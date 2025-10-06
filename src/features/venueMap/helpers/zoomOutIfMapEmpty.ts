import { RefObject } from 'react'

import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { Map } from 'libs/maps/maps'

const getIsMapEmpty = async ({
  mapViewRef,
  venues,
}: {
  mapViewRef: RefObject<Map | null>
  venues: GeolocatedVenue[]
}) => {
  if (!mapViewRef.current) return undefined
  if (venues.length === 0) return undefined

  const mapBoundaries = await mapViewRef.current.getMapBoundaries()

  return venues.every((venue) => {
    if (
      venue._geoloc.lat < mapBoundaries.southWest.latitude ||
      mapBoundaries.northEast.latitude < venue._geoloc.lat
    ) {
      return true
    }
    if (
      venue._geoloc.lng < mapBoundaries.southWest.longitude ||
      mapBoundaries.northEast.longitude < venue._geoloc.lng
    ) {
      return true
    }
    return false
  })
}

export const zoomOutIfMapEmpty = async ({
  mapViewRef,
  venues,
}: {
  mapViewRef: RefObject<Map | null>
  venues: GeolocatedVenue[]
}) => {
  const isMapEmpty = await getIsMapEmpty({
    mapViewRef,
    venues,
  })

  if (isMapEmpty) {
    mapViewRef.current?.fitToCoordinates(
      venues.map((venue) => ({ latitude: venue._geoloc.lat, longitude: venue._geoloc.lng })),
      {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      }
    )
  }
}
