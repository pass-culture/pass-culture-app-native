import { analytics } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'

export const useLogFilterOnce = (filter: string) =>
  useFunctionOnce(() => analytics.logUseFilter(filter))
