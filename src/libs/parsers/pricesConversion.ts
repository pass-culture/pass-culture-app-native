import { AlgoliaHit } from 'libs/algolia'

// Prices are stored in euros in Algolia, but retrieved as cents in OfferResponse
// To follow good frontend practices (see https://frontstuff.io/how-to-handle-monetary-values-in-javascript)
// we convert all prices in Algolia to cents, use cents in the frontend code,
// and when we display the prices to the user, we format the price knowing that there are cents.
export const CENTS_IN_EURO = 100

export const convertEuroToCents = (p: number): number => Math.floor(p * CENTS_IN_EURO)

export const convertAlgoliaHitToCents = (hit: AlgoliaHit): AlgoliaHit => {
  const { prices, priceMax, priceMin, ...offer } = hit.offer
  return {
    ...hit,
    offer: {
      ...offer,
      prices: prices ? prices.map(convertEuroToCents) : undefined,
      priceMax: priceMax ? convertEuroToCents(priceMax) : undefined,
      priceMin: priceMin ? convertEuroToCents(priceMin) : undefined,
    },
  }
}
