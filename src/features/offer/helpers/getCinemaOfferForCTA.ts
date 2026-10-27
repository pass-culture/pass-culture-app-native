import { OfferForStocksResponse, OfferResponse } from 'api/gen'

export const getCinemaOfferForCTA = (offer: OfferForStocksResponse): OfferResponse =>
  ({
    ...offer,
    isDigital: false,
    isEducational: false,
    isEvent: false,
    isForbiddenToUnderage: offer.stocks.some((stock) => stock.isForbiddenToUnderage),
  }) as unknown as OfferResponse
