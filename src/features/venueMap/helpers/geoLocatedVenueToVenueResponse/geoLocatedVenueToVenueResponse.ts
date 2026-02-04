import { VenueResponse } from 'api/gen'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'

export const transformGeoLocatedVenueToVenueResponse = (
  data?: GeolocatedVenue | null
): Omit<VenueResponse, 'isVirtual'> | undefined => {
  if (data && data !== null) {
    const { venueId, label, _geoloc, isOpenToPublic, activity, isPermanent } = data
    return {
      id: venueId,
      name: label,
      longitude: _geoloc.lng,
      latitude: _geoloc.lat,
      accessibilityData: {},
      timezone: '',
      isOpenToPublic,
      activity,
      isPermanent,
    }
  }
  return undefined
}
