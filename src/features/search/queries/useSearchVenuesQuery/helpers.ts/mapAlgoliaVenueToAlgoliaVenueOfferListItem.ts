import { AlgoliaVenue, AlgoliaVenueOfferListItem } from 'libs/algolia/types'

export const mapAlgoliaVenueToAlgoliaVenueOfferListItem = (
  venue: AlgoliaVenue
): AlgoliaVenueOfferListItem => {
  const { objectID, _geoloc, banner_url, activity, name, city, postalCode } = venue
  return {
    objectID,
    _geoloc,
    banner_url: banner_url ?? '',
    activity,
    name,
    city,
    postalCode: postalCode ?? '',
  }
}
