import React, { useRef } from 'react'
import { FlatList } from 'react-native'

import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem'
import { SearchResults } from 'features/search/components/SearchResults'
import { useShowResults } from 'features/search/pages/useShowResults'
import { AlgoliaHit } from 'libs/algolia'

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
    <React.Fragment>
      {appEnableAutocomplete ? (
        <SearchAutocomplete
          ref={listRef}
          hitComponent={Hit}
          isSetShowAutocomplete={isSetShowAutocomplete}
        />
      ) : null}
    </React.Fragment>
  )
}

export type HitProps = {
  hit: AlgoliaHit
  index: number
  isSetShowAutocomplete: (isShowAutocomplete: boolean) => void
}

function Hit({ hit, index, isSetShowAutocomplete }: HitProps) {
  return (
    <SearchAutocompleteItem hit={hit} index={index} isSetShowAutocomplete={isSetShowAutocomplete} />
  )
}
