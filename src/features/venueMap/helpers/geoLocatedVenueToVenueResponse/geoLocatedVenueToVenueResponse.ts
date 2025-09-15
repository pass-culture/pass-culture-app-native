import { VenueResponse } from 'api/gen'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'

export const transformGeoLocatedVenueToVenueResponse = (
  data?: GeolocatedVenue | null
): VenueResponse | undefined => {
  if (data && data !== null) {
    const { venueId, label, _geoloc, isOpenToPublic, venue_type } = data
    return {
      id: venueId,
      name: label,
      longitude: _geoloc.lng,
      latitude: _geoloc.lat,
      accessibility: {},
      timezone: '',
      isVirtual: false,
      isOpenToPublic,
      venueTypeCode: venue_type,
    }
  }
  return undefined
}
