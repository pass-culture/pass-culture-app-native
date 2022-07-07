import { useRoute } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchResults } from 'features/search/components/SearchResults'

export const SearchDetails: React.FC = () => {
  const { params } = useRoute<UseRouteType<'Search'>>()

  return params?.showResults ? <SearchResults /> : <View testID="recentsSearchesAndSuggestions" />
}
