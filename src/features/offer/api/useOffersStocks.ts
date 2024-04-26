import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { OffersStocksResponse } from 'api/gen'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { OfferNotFoundError } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

async function getStocksByOfferIds(offerIds: number[]) {
  if (offerIds.length === 0) {
    throw new OfferNotFoundError(offerIds, { Screen: OfferNotFound })
  }
  try {
    return api.postNativeV1OffersStocks({ offer_ids: offerIds })
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      // This happens when the offer has been rejected but it is still indexed on Algolia
      // due to asynchronous reindexing of the back office
      throw new OfferNotFoundError(offerIds, {
        Screen: OfferNotFound,
        shouldBeCapturedAsInfo: true,
      })
    }
    throw error
  }
}

export const useOffersStocks = ({ offerIds }: { offerIds: number[] }) => {
  const netInfo = useNetInfoContext()

  return useQuery<OffersStocksResponse>(
    [QueryKeys.OFFER, offerIds],
    () => getStocksByOfferIds(offerIds),
    { enabled: !!netInfo.isConnected }
  )
}
