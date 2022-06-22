import React, { useRef } from 'react'
import { FlatList, View } from 'react-native'

import { InfiniteHits } from 'features/search/components/InfiniteHits'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem'
import { SearchResults } from 'features/search/components/SearchResults'
import { useShowResults } from 'features/search/pages/useShowResults'
import { AlgoliaHit } from 'libs/algolia'

export const SearchDetails: React.FC = () => {
  const listRef = useRef<FlatList>(null)
  const showResults = useShowResults()

  return showResults ? (
    <SearchResults />
  ) : (
    <View testID="recentsSearchesAndSuggestions">
      <InfiniteHits ref={listRef} hitComponent={Hit} />
    </View>
  )
}

type HitProps = {
  hit: AlgoliaHit
  index: number
}

function Hit({ hit, index }: HitProps) {
  return <SearchAutocompleteItem hit={hit} index={index} />
}
