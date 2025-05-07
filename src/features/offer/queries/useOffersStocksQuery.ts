import { useQuery } from 'react-query'

import { OffersStocksResponseV2 } from 'api/gen'
import { getStocksByOfferIds } from 'features/offer/api/getStocksByOfferIds'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { QueryKeys } from 'libs/queryKeys'

export const useOffersStocksQuery = ({ offerIds }: { offerIds: number[] }) => {
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<OffersStocksResponseV2>([QueryKeys.OFFER, offerIds], () =>
    getStocksByOfferIds(offerIds, logType)
  )
}
