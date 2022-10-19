import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import { FlatList } from 'react-native'

import { HitProps } from 'features/search/pages/Search'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { getSpacing } from 'ui/theme'

type Props = UseInfiniteHitsProps & {
  hitComponent: (props: HitProps) => JSX.Element
}

export const SearchAutocomplete: React.FC<Props> = ({ hitComponent: Item, ...props }) => {
  const { hits, sendEvent } = useInfiniteHits(props)
  const contentContainerStyle = { paddingHorizontal: getSpacing(6), paddingTop: getSpacing(4) }

  return (
    <FlatList
      listAs="ul"
      itemAs="li"
      contentContainerStyle={contentContainerStyle}
      data={hits as unknown as AlgoliaSuggestionHit[]}
      keyExtractor={(item) => item.objectID}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      testID="autocompleteList"
      renderItem={({ item }) => (
        <Item hit={item as unknown as AlgoliaSuggestionHit} sendEvent={sendEvent} />
      )}
    />
  )
}
