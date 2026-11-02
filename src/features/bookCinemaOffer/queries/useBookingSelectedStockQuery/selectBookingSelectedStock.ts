import { OfferResponse, OfferStockResponse } from 'api/gen'

export const selectBookingSelectedStock =
  (stockId?: number) =>
  (offer: OfferResponse): OfferStockResponse | undefined => {
    if (!stockId) return undefined
    return offer.stocks.find(({ id }) => id === stockId)
  }
