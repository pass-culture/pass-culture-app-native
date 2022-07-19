import { useRoute } from '@react-navigation/native'
import React, { useRef } from 'react'
import { FlatList } from 'react-native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem'
import { SearchResults } from 'features/search/components/SearchResults'
import { SearchView } from 'features/search/types'
import { AlgoliaHit } from 'libs/algolia'

type Props = {
  appEnableAutocomplete: boolean
}

export const SearchDetails: React.FC<Props> = ({ appEnableAutocomplete }) => {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const listRef = useRef<FlatList>(null)

  return params?.view === SearchView.Results ? (
    <SearchResults />
  ) : (
    <React.Fragment>
      {!!appEnableAutocomplete && <SearchAutocomplete ref={listRef} hitComponent={Hit} />}
    </React.Fragment>
  )
}

export type HitProps = {
  hit: AlgoliaHit
  index: number
}

export function Hit({ hit, index }: HitProps) {
  return <SearchAutocompleteItem hit={hit} index={index} />
}
