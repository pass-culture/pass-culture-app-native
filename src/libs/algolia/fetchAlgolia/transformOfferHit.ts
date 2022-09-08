import { useCallback } from 'react'

import { useAppSettings } from 'features/auth/settings'
import { convertEuroToCents } from 'libs/parsers/pricesConversion'
import { IncompleteSearchHit } from 'libs/search'

import { AlgoliaHit } from '..'

// Go to https://github.com/pass-culture/pass-culture-api/blob/master/src/pcapi/algolia/infrastructure/builder.py
// to see how the data is indexed into the search client (algolia => app search)

type Offer = AlgoliaHit['offer']

// Prices are stored in euros in Algolia, but retrieved as cents in OfferResponse
// To follow good frontend practices (see https://frontstuff.io/how-to-handle-monetary-values-in-javascript)
// we convert all prices in Algolia to cents, use cents in the frontend code,
// and when we display the prices to the user, we format the price knowing that there are cents.
const convertAlgoliaOfferToCents = <T extends Offer>(offer: T): T => ({
  ...offer,
  prices: offer.prices ? offer.prices.map(convertEuroToCents) : undefined,
})

// (PC-8526): due to the migration to GCP, we extract the path to the image
export const parseThumbUrl = (
  thumbUrl: Offer['thumbUrl'],
  urlPrefix?: string
): Offer['thumbUrl'] => {
  if (!thumbUrl) return undefined
  if (!urlPrefix) return thumbUrl
  const [base, suffix] = thumbUrl.split('/thumbs')
  return `${urlPrefix || base}/thumbs${suffix}`
}

// The _geoloc is hardcoded for digital offers (without position) so that the results appear in the Search:
// original PR: https://github.com/pass-culture/pass-culture-api/pull/1334
// Here we dehardcode those coordinates, so that we don't show a wrong distance to the user.
const parseGeoloc = (hit: AlgoliaHit): AlgoliaHit['_geoloc'] =>
  hit.offer.isDigital ? { lat: null, lng: null } : hit._geoloc

// We don't want to display offers without image nor subcategoryId
export const filterOfferHit = (hit: IncompleteSearchHit): boolean =>
  hit && hit.offer && !!hit.offer.thumbUrl && typeof hit.offer.subcategoryId !== 'undefined'

export const transformOfferHit =
  (urlPrefix?: string) =>
  (hit: AlgoliaHit): AlgoliaHit => ({
    ...hit,
    offer: {
      ...hit.offer,
      ...convertAlgoliaOfferToCents(hit.offer),
      thumbUrl: parseThumbUrl(hit.offer.thumbUrl, urlPrefix),
    },
    _geoloc: parseGeoloc(hit),
  })

export const useTransformOfferHits = () => {
  const { data: settings } = useAppSettings()
  const { objectStorageUrl: urlPrefix } = settings || {}

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(transformOfferHit(urlPrefix), [urlPrefix])
}
