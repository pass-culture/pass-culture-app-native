import { OfferForStocksResponse, OfferResponse, SubcategoryIdEnum } from 'api/gen'

export const getCinemaOfferForCTA = (offer: OfferForStocksResponse): OfferResponse => ({
  ...offer,
  accessibility: {},
  artists: [],
  chronicles: [],
  isDigital: false,
  isEducational: false,
  isEvent: false,
  isForbiddenToUnderage: offer.stocks.some((stock) => stock.isForbiddenToUnderage),
  isHeadline: false,
  metadata: null,
  reactionsCount: { likes: 0 },
  stocks: offer.stocks.map((stock) => ({ ...stock, features: [] })),
  subcategoryId: offer.subcategoryId as SubcategoryIdEnum,
})
