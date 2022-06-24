import React, { useRef } from 'react'
import { FlatList } from 'react-native'

import { InfiniteHits } from 'features/search/components/InfiniteHits'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem'
import { SearchResults } from 'features/search/components/SearchResults'
import { useShowResults } from 'features/search/pages/useShowResults'
import { AlgoliaHit } from 'libs/algolia'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

type Props = {
  isShowAutocomplete: boolean
  appEnableAutocomplete: boolean
  isSetShowAutocomplete: (isShowAutocomplete: boolean) => void
}

export const SearchDetails: React.FC<Props> = ({
  isShowAutocomplete,
  appEnableAutocomplete,
  isSetShowAutocomplete,
}) => {
  const listRef = useRef<FlatList>(null)
  const showResults = useShowResults()
  const showResultsWithoutAutocomplete = !appEnableAutocomplete && showResults
  const showResultsWithAutocomplete = appEnableAutocomplete && showResults && !isShowAutocomplete

  return showResultsWithoutAutocomplete || showResultsWithAutocomplete ? (
    <SearchResults />
  ) : (
    <TouchableOpacity
      testID="recentsSearchesAndSuggestions"
      onPress={() => isSetShowAutocomplete(false)}>
      {appEnableAutocomplete ? <InfiniteHits ref={listRef} hitComponent={Hit} /> : null}
    </TouchableOpacity>
  )
}

export type HitProps = {
  hit: AlgoliaHit
  index: number
}

function Hit({ hit, index }: HitProps) {
  return <SearchAutocompleteItem hit={hit} index={index} />
}
