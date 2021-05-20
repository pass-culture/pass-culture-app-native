import { useCallback } from 'react'

import { useAppSettings } from 'features/auth/settings'
import { AlgoliaHit, SearchAlgoliaHit } from 'libs/algolia'
import { convertEuroToCents } from 'libs/parsers/pricesConversion'

// Go to https://github.com/pass-culture/pass-culture-api/blob/master/src/pcapi/algolia/infrastructure/builder.py
// to see how the data is indexed into algolia

type Hit = AlgoliaHit | SearchAlgoliaHit
type Offer = Hit['offer']

// Prices are stored in euros in Algolia, but retrieved as cents in OfferResponse
// To follow good frontend practices (see https://frontstuff.io/how-to-handle-monetary-values-in-javascript)
// we convert all prices in Algolia to cents, use cents in the frontend code,
// and when we display the prices to the user, we format the price knowing that there are cents.
export const convertAlgoliaOfferToCents = <T extends Offer>(offer: T): T => ({
  ...offer,
  prices: offer.prices ? offer.prices.map(convertEuroToCents) : undefined,
  priceMax: offer.priceMax ? convertEuroToCents(offer.priceMax) : undefined,
  priceMin: offer.priceMin ? convertEuroToCents(offer.priceMin) : undefined,
})

// (PC-8526): due to the migration to GCP, we extract the path to the image
export const parseThumbUrl = (
  thumbUrl: Offer['thumbUrl'],
  _urlPrefix: string
): Offer['thumbUrl'] => {
  return thumbUrl
}

// The _geoloc is hardcoded for digital offers (without position) so that the results appear in the Search:
// original PR: https://github.com/pass-culture/pass-culture-api/pull/1334
// Here we dehardcode those coordinates, so that we don't show a wrong distance to the user.
export const parseGeoloc = (hit: Hit): Hit['_geoloc'] =>
  hit.offer.isDigital ? { lat: null, lng: null } : hit._geoloc

// We don't want to display offers without image
export const filterAlgoliaHit = (hit: AlgoliaHit): boolean =>
  hit && hit.offer && !!hit.offer.thumbUrl

export const transformAlgoliaHit = (urlPrefix: string) => <T extends Hit>(hit: T): T => ({
  ...hit,
  offer: {
    ...hit.offer,
    ...convertAlgoliaOfferToCents(hit.offer),
    thumbUrl: parseThumbUrl(hit.offer.thumbUrl, urlPrefix),
  },
  _geoloc: parseGeoloc(hit),
})

export const useTransformAlgoliaHits = () => {
  const { data: _settings } = useAppSettings()
  const urlPrefix = 'urlPrefix'

  return useCallback(transformAlgoliaHit(urlPrefix), [urlPrefix])
}
