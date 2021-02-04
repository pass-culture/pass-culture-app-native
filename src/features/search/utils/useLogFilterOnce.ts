import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'

export const useLogFilterOnce = (filter: string) =>
  useFunctionOnce(() => analytics.logUseFilter(filter))
