import { uniqBy } from 'lodash'

import { Activity } from 'api/gen'
import {
  AlgoliaOffer,
  AlgoliaVenue,
  AlgoliaVenueOffer,
  AlgoliaVenueOfferListItem,
  Geoloc,
} from 'libs/algolia/types'

export type AlgoliaVenueOfferWithGeoloc = AlgoliaVenueOffer & {
  geoloc: Geoloc
}

export const getReconciledVenues = (
  offers: AlgoliaOffer[],
  venues: AlgoliaVenue[]
): Array<AlgoliaVenueOfferListItem> => {
  const venueIds = venues.map((venue) => venue.objectID)
  // dedupe venues from algolia offers
  const reconciledVenues: Array<AlgoliaVenueOfferWithGeoloc> = uniqBy(offers, 'venue.id')
    .map((offer: AlgoliaOffer) => ({
      ...offer.venue,
      geoloc: offer._geoloc,
    }))
    .filter((venue) => venue.isPermanent)

  // dedupe algolia venues with venues from algolia offers
  return venueIds.length
    ? venues
        .map(convertAlgoliaVenue2AlgoliaVenueOfferListItem)
        .concat(
          reconciledVenues
            .filter(
              (venueWGeoloc: AlgoliaVenueOfferWithGeoloc) =>
                !!venueWGeoloc.id && !venueIds.includes(venueWGeoloc.id.toString())
            )
            .map(convertAlgoliaVenueOffer2AlgoliaVenueOfferListItem)
        )
    : reconciledVenues.map(convertAlgoliaVenueOffer2AlgoliaVenueOfferListItem)
}

export const convertAlgoliaVenue2AlgoliaVenueOfferListItem = (
  venue: AlgoliaVenue
): AlgoliaVenueOfferListItem => ({
  objectID: venue.objectID,
  banner_url: venue.banner_url ?? '',
  activity: venue.activity,
  name: venue.name,
  city: venue.city,
  postalCode: venue.postalCode ?? '',
  _geoloc: venue._geoloc,
})

export const convertAlgoliaVenueOffer2AlgoliaVenueOfferListItem = (
  venue: AlgoliaVenueOfferWithGeoloc
): AlgoliaVenueOfferListItem => ({
  objectID: venue.id?.toString() ?? '',
  banner_url: venue.banner_url ?? '',
  activity: venue.activity ?? Activity.OTHER,
  name: venue.name ?? '',
  city: venue.city ?? '',
  postalCode: venue.postalCode ?? '',
  _geoloc: venue.geoloc,
})
