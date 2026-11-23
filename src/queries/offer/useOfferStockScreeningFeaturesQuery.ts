import { useOffersStocksSpecialEventQuery } from 'features/offer/queries/useOffersStocksSpecialEventQuery'
import { selectOfferStock } from 'queries/offer/selectors/selectOfferStock'

export const useOfferStockScreeningFeaturesQuery = (
  offerId: number | undefined,
  stockId: number | undefined
) =>
  useOffersStocksSpecialEventQuery(
    { offerIds: typeof offerId === 'number' ? [offerId] : [] },
    {
      enabled: typeof offerId === 'number',
      select: selectOfferStock(stockId),
    }
  )
