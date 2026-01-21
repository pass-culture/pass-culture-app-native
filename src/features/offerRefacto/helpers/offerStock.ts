import { OfferResponseV2 } from 'api/gen'

export function extractStockDates(offer: OfferResponseV2): string[] {
  return offer.stocks
    .map((stock) => stock.beginningDatetime)
    .filter((date): date is string => date !== null && date !== undefined)
}
