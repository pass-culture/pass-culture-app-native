import { SubcategoryIdEnum } from 'api/gen'
import { AlgoliaOfferHit } from 'libs/algolia'
import { convertEuroToCents } from 'libs/parsers/pricesConversion'
import { Offer, OfferAttributes } from 'shared/offer/types'

export const adaptAlgoliaHit = (
  algoliaHits: AlgoliaOfferHit[],
  imageUrlPrefix?: string
): Offer[] => {
  const adaptedOffers = algoliaHits.map((algoliaHit) => ({
    objectID: algoliaHit.objectID,
    _geoloc: getOfferGeoloc(algoliaHit),
    offer: {
      ...algoliaHit.offer,
      prices: algoliaHit.offer.prices ? algoliaHit.offer.prices.map(convertEuroToCents) : undefined,
      thumbUrl: parseThumbUrl(algoliaHit.offer.thumbUrl, imageUrlPrefix),
    },
  }))

  const filteredOffers = adaptedOffers.filter<Offer>(filterOffer)

  return filteredOffers
}

// The _geoloc is hardcoded for digital offers (without position) so that the results appear in the Search:
// original PR: https://github.com/pass-culture/pass-culture-api/pull/1334
// Here we dehardcode those coordinates, so that we don't show a wrong distance to the user.
const getOfferGeoloc = (algoliaHit: AlgoliaOfferHit): Offer['_geoloc'] =>
  algoliaHit.offer.isDigital ? { lat: null, lng: null } : algoliaHit._geoloc

export const parseThumbUrl = (
  thumbUrl: AlgoliaOfferHit['offer']['thumbUrl'],
  urlPrefix?: string
): Offer['offer']['thumbUrl'] => {
  if (!thumbUrl) return undefined
  if (!urlPrefix) return thumbUrl
  const [base, suffix] = thumbUrl.split('/thumbs')
  return `${urlPrefix || base}/thumbs${suffix}`
}

// We don't want to display offers without image nor subcategoryId
const filterOffer = (offer: OfferWithOptionnalSubcategoryIds): offer is Offer =>
  offer && offer.offer && !!offer.offer.thumbUrl && typeof offer.offer.subcategoryId !== 'undefined'

type OfferWithOptionnalSubcategoryIds = {
  offer: Omit<OfferAttributes, 'subcategoryId'> & {
    subcategoryId?: SubcategoryIdEnum | undefined
  }
  objectID: Offer['objectID']
  _geoloc: Offer['_geoloc']
}
