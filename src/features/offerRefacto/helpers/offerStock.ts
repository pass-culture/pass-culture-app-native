import { OfferResponse } from 'api/gen'

export function extractStockDates(offer: OfferResponse): string[] {
  return offer.stocks
    .map((stock) => stock.beginningDatetime)
    .filter((date): date is string => date !== null && date !== undefined)
}
