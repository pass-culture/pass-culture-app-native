import { useRoute } from '@react-navigation/native'
import React, { useRef } from 'react'
import { FlatList } from 'react-native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem'
import { SearchResults } from 'features/search/components/SearchResults'
import { AlgoliaHit } from 'libs/algolia'

type Props = {
  shouldAutocomplete: boolean
  appEnableAutocomplete: boolean
  setShouldAutocomplete: (shouldAutocomplete: boolean) => void
}

export const SearchDetails: React.FC<Props> = ({
  shouldAutocomplete,
  appEnableAutocomplete,
  setShouldAutocomplete,
}) => {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const listRef = useRef<FlatList>(null)
  const showResultsWithoutAutocomplete = !appEnableAutocomplete && params?.showResults
  const showResultsWithAutocomplete =
    appEnableAutocomplete && params?.showResults && !shouldAutocomplete

  return showResultsWithoutAutocomplete || showResultsWithAutocomplete ? (
    <SearchResults />
  ) : (
    <React.Fragment>
      {appEnableAutocomplete ? (
        <SearchAutocomplete
          ref={listRef}
          hitComponent={Hit}
          setShouldAutocomplete={setShouldAutocomplete}
        />
      ) : null}
    </React.Fragment>
  )
}

export type HitProps = {
  hit: AlgoliaHit
  index: number
  setShouldAutocomplete: (isShowAutocomplete: boolean) => void
}

function Hit({ hit, index, setShouldAutocomplete }: HitProps) {
  return (
    <SearchAutocompleteItem hit={hit} index={index} setShouldAutocomplete={setShouldAutocomplete} />
  )
}
