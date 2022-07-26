import React, { useRef } from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import { FlatList } from 'react-native'

import { HitProps } from 'features/search/pages/Search'
import { AlgoliaHit } from 'libs/algolia'
import { getSpacing } from 'ui/theme'

type Props = UseInfiniteHitsProps & {
  hitComponent: (props: HitProps) => JSX.Element
}

export const SearchAutocomplete: React.FC<Props> = ({ hitComponent: Item, ...props }) => {
  const { hits } = useInfiniteHits(props)
  const contentContainerStyle = { paddingHorizontal: getSpacing(6), paddingTop: getSpacing(4) }
  const ref = useRef<FlatList<AlgoliaHit>>(null)

  return (
    <FlatList
      ref={ref}
      contentContainerStyle={contentContainerStyle}
      data={hits as unknown as AlgoliaHit[]}
      keyExtractor={(item) => item.objectID}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      testID="autocompleteList"
      renderItem={({ item, index }) => <Item hit={item as unknown as AlgoliaHit} index={index} />}
    />
  )
}
