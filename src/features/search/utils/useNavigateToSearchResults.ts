import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { Referrals } from 'features/navigation/RootNavigator'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/analytics'

export const useNavigateToSearchResults = ({ from }: { from: Referrals }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { dispatch } = useSearch()

  return useCallback(() => {
    analytics.logDiscoverOffers(from)
    dispatch({ type: 'INIT' })
    navigate(...getTabNavConfig('Search', { showResults: true }))
  }, [])
}
