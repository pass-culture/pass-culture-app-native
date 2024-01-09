import { useCallback } from 'react'

import { Referrals } from 'features/navigation/RootNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { analytics } from 'libs/analytics'

export const useLogBeforeNavToSearchResults = ({ from }: { from: Referrals }) => {
  const { resetSearch } = useSearch()

  return useCallback(() => {
    analytics.logDiscoverOffers(from)
    resetSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
