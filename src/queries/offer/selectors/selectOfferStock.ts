import { OffersStocksResponse } from 'api/gen'

export const selectOfferStock = (stockId: number | undefined) => (data: OffersStocksResponse) => {
  if (typeof stockId !== 'number') return undefined

  return data.offers.flatMap((offer) => offer.stocks).find((item) => item.id === stockId)
}
