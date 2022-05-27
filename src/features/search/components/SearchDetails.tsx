import React from 'react'
import { View } from 'react-native'

import { SearchResults } from 'features/search/components/SearchResults'
import { useShowResults } from 'features/search/pages/useShowResults'

export const SearchDetails: React.FC = () => {
  const showResults = useShowResults()

  return showResults ? <SearchResults /> : <View testID="recentsSearchesAndSuggestions" />
}
