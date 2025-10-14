import { useCallback } from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { AlgoliaOffer, HitOffer } from 'libs/algolia/types'
import { convertEuroToCents } from 'libs/parsers/pricesConversion'
import { SubcategoriesMapping } from 'libs/subcategories/types'

// Go to https://github.com/pass-culture/pass-culture-api/blob/master/src/pcapi/algolia/infrastructure/builder.py
// to see how the data is indexed into the search client (algolia => app search)

// Prices are stored in euros in Algolia, but retrieved as cents in OfferResponseV2
// To follow good frontend practices (see https://frontstuff.io/how-to-handle-monetary-values-in-javascript)
// we convert all prices in Algolia to cents, use cents in the frontend code,
// and when we display the prices to the user, we format the price knowing that there are cents.
const convertAlgoliaOfferToCents = <T extends HitOffer>(offer: T): T => ({
  ...offer,
  prices: offer.prices ? offer.prices.map((price) => convertEuroToCents(price)) : undefined,
})

// (PC-8526): due to the migration to GCP, we extract the path to the image
export const parseThumbUrl = (
  thumbUrl: HitOffer['thumbUrl'],
  urlPrefix?: string
): HitOffer['thumbUrl'] => {
  if (!thumbUrl) return undefined
  if (!urlPrefix) return thumbUrl
  const [base, suffix] = thumbUrl.split('/thumbs')
  return `${String(urlPrefix || base)}/thumbs${String(suffix)}`
}

// The _geoloc is hardcoded for digital offers (without position) so that the results appear in the Search:
// original PR: https://github.com/pass-culture/pass-culture-api/pull/1334
// Here we dehardcode those coordinates, so that we don't show a wrong distance to the user.
const parseGeoloc = (hit: AlgoliaOffer): AlgoliaOffer['_geoloc'] =>
  hit.offer.isDigital ? { lat: null, lng: null } : hit._geoloc

// We don't want to display offers without image nor subcategoryId
export const filterOfferHitWithImage = (hit?: AlgoliaOffer): hit is AlgoliaOffer =>
  !!hit && hit.offer && !!hit.offer.thumbUrl

export const filterValidOfferHit = (hit?: AlgoliaOffer): hit is AlgoliaOffer => !!hit && !!hit.offer

export const transformOfferHit =
  (urlPrefix?: string) =>
  (hit: AlgoliaOffer): AlgoliaOffer => ({
    ...hit,
    offer: {
      ...hit.offer,
      ...convertAlgoliaOfferToCents(hit.offer),
      thumbUrl: parseThumbUrl(hit.offer.thumbUrl, urlPrefix),
    },
    _geoloc: parseGeoloc(hit),
    venue: hit.venue,
  })

export const useTransformOfferHits = () => {
  const { data: settings } = useSettingsContext()
  const { objectStorageUrl: urlPrefix } = settings || {}

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(transformOfferHit(urlPrefix), [urlPrefix])
}

export const sortHitOffersByDate = (
  hitA: AlgoliaOffer<HitOffer> | undefined,
  hitB: AlgoliaOffer<HitOffer> | undefined
) => {
  const datesA = hitA?.offer?.dates
  datesA?.sort((a, b) => a - b)
  const datesB = hitB?.offer?.dates
  datesB?.sort((a, b) => a - b)
  const dateA = datesA ? datesA[0] : 0
  const dateB = datesB ? datesB[0] : 0
  return (dateA ?? 0) - (dateB ?? 0)
}

export const determineAllOffersAreEventsAndNotCinema = (
  hits: Array<AlgoliaOffer<HitOffer>>,
  mapping: SubcategoriesMapping | undefined
) =>
  hits.every((hit) => {
    return (
      mapping?.[hit.offer.subcategoryId].isEvent &&
      hit.offer.subcategoryId !== SubcategoryIdEnum.SEANCE_CINE
    )
  })
