import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { OnPressCategory } from 'features/search/components/CategoriesButtons'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/firebase/analytics'

import { SearchView } from '../types'

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
