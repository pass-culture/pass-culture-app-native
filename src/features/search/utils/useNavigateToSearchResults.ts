import { useNavigation } from '@react-navigation/native'

import { Referrals } from 'features/navigation/RootNavigator'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/analytics'

export const useNavigateToSearchResults = ({ from }: { from: Referrals }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { dispatch } = useSearch()

  return () => {
    analytics.logDiscoverOffers(from)
    dispatch({ type: 'SHOW_RESULTS', payload: true })
    navigate('Search')
  }
}
