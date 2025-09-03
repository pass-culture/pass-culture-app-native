import { useQuery } from '@tanstack/react-query'

import { OffersStocksResponseV2 } from 'api/gen'
import { getStocksByOfferIds } from 'features/offer/api/getStocksByOfferIds'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { QueryKeys } from 'libs/queryKeys'

export const useOffersStocksQuery = <TData = OffersStocksResponseV2>(
  { offerIds }: { offerIds: number[] },
  select?: (data: OffersStocksResponseV2) => TData
) => {
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<OffersStocksResponseV2, Error, TData>({
    queryKey: [QueryKeys.OFFER, offerIds],
    queryFn: () => getStocksByOfferIds(offerIds, logType),
    select,
  })
}
