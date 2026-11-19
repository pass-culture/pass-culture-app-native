import { useQuery } from '@tanstack/react-query'

import { OffersStocksResponse } from 'api/gen'
import { getStocksByOfferIdsSpecialEvent } from 'features/offer/api/getStocksByOfferIdsSpecialEvent'
import { convertOffererDatesToTimezone } from 'features/offer/queries/selectors/convertOffererDatesToTimezone'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { QueryKeys } from 'libs/queryKeys'

export const useOffersStocksSpecialEventQuery = <TData = OffersStocksResponse>(
  { offerIds }: { offerIds: number[] },
  options?: {
    enabled: boolean
    select?: (data: OffersStocksResponse) => TData
  }
) => {
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<OffersStocksResponse, Error, TData>({
    queryKey: [QueryKeys.OFFER_STOCKS_SPECIAL_EVENT, offerIds],
    queryFn: () => getStocksByOfferIdsSpecialEvent(offerIds, logType),
    select: (data) =>
      options?.select
        ? options.select(convertOffererDatesToTimezone(data))
        : (convertOffererDatesToTimezone(data) as TData),
    enabled: options?.enabled,
  })
}
