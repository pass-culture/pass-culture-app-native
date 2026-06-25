import { OfferCtaData } from 'features/offerCtaPoc/types'

// Raw server DTO shape (infra). Deliberately different from the domain shape:
// renamed/nested fields, nullable booking id — to show what `select` adapts.
export type OfferCtaApiResponse = {
  offer: {
    id: number
    title: string
    price: number
    soldOut: boolean
  }
  viewer: {
    authenticated: boolean
    hasEnoughCredit: boolean
    existingBookingOfferId: number | null
  }
}

// Pure ADAPTER (DTO -> domain). This is exactly what React Query's `select`
// is for: narrowing/reshaping server data. It does NOT take any business
// decision — that stays in the pure core (`resolveOfferCta`).
export const offerCtaResponseToData = (response: OfferCtaApiResponse): OfferCtaData => ({
  offer: {
    id: response.offer.id,
    name: response.offer.title,
    priceInCents: response.offer.price,
    isSoldOut: response.offer.soldOut,
  },
  user: {
    isLoggedIn: response.viewer.authenticated,
    hasEnoughCredit: response.viewer.hasEnoughCredit,
    alreadyBookedOfferId: response.viewer.existingBookingOfferId ?? undefined,
  },
})
