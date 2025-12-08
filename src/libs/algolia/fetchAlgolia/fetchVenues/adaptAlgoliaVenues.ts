import { Venue } from 'features/venue/types'
import { AlgoliaVenue } from 'libs/algolia/types'

export const adaptAlgoliaVenues = (venues: AlgoliaVenue[]): Venue[] =>
  venues.map((venue) => ({
    label: venue.name,
    info: venue.city || venue.offerer_name,
    venueId: parseInt(venue.objectID),
    _geoloc: venue._geoloc,
    banner_url: venue.banner_url,
    activity: venue.activity,
    postalCode: venue.postalCode,
    isPermanent: venue.isPermanent === undefined ? true : venue.isPermanent,
    isOpenToPublic: venue.isOpenToPublic,
  }))
