import { Venue } from 'features/venue/types'
import { AlgoliaVenue } from 'libs/algolia/types'

export const adaptAlgoliaVenues = (venues: AlgoliaVenue[]): Venue[] =>
  venues.map((venue) => ({
    label: venue.name,
    info: venue.city || venue.offerer_name,
    venueId: parseInt(venue.objectID),
  }))
