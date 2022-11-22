import { useCallback } from 'react'

import { Referrals } from 'features/navigation/RootNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { analytics } from 'libs/firebase/analytics'

export const useLogBeforeNavToSearchResults = ({ from }: { from: Referrals }) => {
  const { dispatch } = useSearch()

  return useCallback(() => {
    analytics.logDiscoverOffers(from)
    dispatch({ type: 'INIT' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
