import { analytics } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'

export const useLogFilterOnce = (filter: string) =>
  useFunctionOnce(() => analytics.logUseFilter(filter))
