import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearch } from 'features/search/context/SearchWrapper'
import { OnPressCategory } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'

export const useShowResultsForCategory = (): OnPressCategory => {
  const { searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()

  return useCallback(
    (pressedCategory) => {
      const searchId = uuidv4()
      analytics.logUseLandingCategory(pressedCategory, searchId)
      navigate(
        ...getTabNavConfig('Search', {
          ...searchState,
          offerCategories: [pressedCategory],
          view: SearchView.Results,
          searchId,
        })
      )
    },
    [navigate, searchState]
  )
}
