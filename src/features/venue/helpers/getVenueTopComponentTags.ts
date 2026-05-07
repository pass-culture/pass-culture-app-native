import { VenueResponse } from 'api/gen'
import { getDistance } from 'libs/location/getDistance'
import { LocationMode, Position } from 'libs/location/types'
import { MAP_ACTIVITY_TO_LABEL } from 'libs/parsers/activity'
import { SuggestedPlace } from 'libs/place/types'

export const getVenueTopComponentTags = (
  venue: VenueResponse,
  userLocation: Position,
  selectedPlace: SuggestedPlace | null,
  selectedLocationMode: LocationMode
) => {
  if (venue.isOpenToPublic) {
    const distanceToVenue = getDistance(
      { lat: venue.latitude, lng: venue.longitude },
      { userLocation, selectedPlace, selectedLocationMode }
    )
    const distanceLabel = distanceToVenue ? `À ${distanceToVenue}` : undefined
    const activityLabel = venue.activity ? MAP_ACTIVITY_TO_LABEL[venue.activity] : undefined

    return [activityLabel, distanceLabel].filter((tag): tag is string => !!tag)
  }

  return (venue.culturalDomains ?? []).map((domain) => domain.name)
}
