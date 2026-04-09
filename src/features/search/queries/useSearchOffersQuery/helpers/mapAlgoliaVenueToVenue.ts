import { Activity } from 'api/gen'
import { Venue } from 'features/venue/types'
import { AlgoliaVenueOffer, Geoloc } from 'libs/algolia/types'

export const mapAlgoliaVenueToVenue = (venue: AlgoliaVenueOffer, geoloc?: Geoloc): Venue => {
  const { id, name, address, city, activity, ...rest } = venue

  return {
    venueId: id ?? null,
    label: name ?? '',
    info: address && city ? `${address}, ${city}` : '',
    activity: (activity as Activity) ?? null,
    _geoloc: geoloc,
    isOpenToPublic: true,
    banner_url: rest.banner_url ?? null,
    postalCode: rest.postalCode ?? null,
    isPermanent: rest.isPermanent ?? null,
  }
}
