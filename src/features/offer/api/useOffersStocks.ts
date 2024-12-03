import { useQuery } from 'react-query'

import { OffersStocksResponseV2 } from 'api/gen'
import { getStocksByOfferIds } from 'features/offer/api/getStocksByOfferIds'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useOffersStocks = ({ offerIds }: { offerIds: number[] }) => {
  const netInfo = useNetInfoContext()
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<OffersStocksResponseV2>(
    [QueryKeys.OFFER, offerIds],
    () => getStocksByOfferIds(offerIds, logType),
    {
      enabled: !!netInfo.isConnected && !!netInfo.isInternetReachable,
    }
  )
}
