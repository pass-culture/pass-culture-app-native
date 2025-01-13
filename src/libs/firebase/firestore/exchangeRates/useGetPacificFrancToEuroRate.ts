import { onlineManager, useQuery } from 'react-query'

import { getExchangeRates } from 'libs/firebase/firestore/exchangeRates/getExchangeRates'
import { QueryKeys } from 'libs/queryKeys'

export const DEFAULT_PACIFIC_FRANC_TO_EURO_RATE = 0.00838

export const useGetPacificFrancToEuroRate = (): number => {
  const { data: pacificFrancToEuroRate } = useQuery(QueryKeys.EXCHANGE_RATES, getExchangeRates, {
    staleTime: 1000 * 30,
    cacheTime: 1000 * 30,
    enabled: onlineManager.isOnline(),
  })

  return pacificFrancToEuroRate ?? DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
}
