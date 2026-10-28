import { useQuery } from '@tanstack/react-query'

import { OffersStocksResponse } from 'api/gen'
import { getStocksByOfferIds } from 'features/offer/api/getStocksByOfferIds'
import { convertOffererDatesToTimezone } from 'features/offer/queries/selectors/convertOffererDatesToTimezone'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { QueryKeys } from 'libs/queryKeys'

export const useOffersStocksQuery = <TData = OffersStocksResponse>(
  { offerIds }: { offerIds: number[] },
  options?: {
    enabled: boolean
    select?: (data: OffersStocksResponse) => TData
  }
) => {
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<OffersStocksResponse, Error, TData>({
    queryKey: [QueryKeys.OFFER, offerIds],
    queryFn: () => getStocksByOfferIds(offerIds, logType),
    select: (data) =>
      options?.select
        ? options.select(convertOffererDatesToTimezone(data))
        : (convertOffererDatesToTimezone(data) as TData),
    enabled: options?.enabled,
  })
}
