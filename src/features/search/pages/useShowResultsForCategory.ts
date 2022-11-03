import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { OnPressCategory } from 'features/search/components/CategoriesButtons'
import { useSearch } from 'features/search/pages/SearchWrapper'

import { SearchView } from '../types'

export const useShowResultsForCategory = (): OnPressCategory => {
  const { searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()

  return useCallback(
    (pressedCategory) => {
      navigate(
        ...getTabNavConfig('Search', {
          ...searchState,
          offerCategories: [pressedCategory],
          view: SearchView.Results,
        })
      )
    },
    [navigate, searchState]
  )
}
