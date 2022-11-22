import { analytics } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'

export const useLogFilterOnce = (filter: string, searchId?: string) =>
  useFunctionOnce(() => analytics.logUseFilter(filter, searchId))
