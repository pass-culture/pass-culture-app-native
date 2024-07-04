import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { OffersStocksResponseV2 } from 'api/gen'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { OfferNotFoundError } from 'libs/monitoring'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

async function getStocksByOfferIds(offerIds: number[], logType: LogTypeEnum) {
  if (offerIds.length === 0) {
    throw new OfferNotFoundError(offerIds, {
      Screen: OfferNotFound,
      logType,
    })
  }
  try {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await api.postNativeV2OffersStocks({
      offer_ids: offerIds,
    })
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      // This happens when the offer has been rejected but it is still indexed on Algolia
      // due to asynchronous reindexing of the back office
      throw new OfferNotFoundError(offerIds, {
        Screen: OfferNotFound,
        logType,
      })
    }
    throw error
  }
}

export const useOffersStocks = ({ offerIds }: { offerIds: number[] }) => {
  const netInfo = useNetInfoContext()
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<OffersStocksResponseV2>(
    [QueryKeys.OFFER, offerIds],
    () => getStocksByOfferIds(offerIds, logType),
    { enabled: !!netInfo.isConnected }
  )
}
