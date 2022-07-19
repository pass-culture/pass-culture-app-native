import React, { forwardRef, Ref } from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import { FlatList } from 'react-native'

import { HitProps } from 'features/search/components/SearchDetails'
import { AlgoliaHit } from 'libs/algolia'
import { getSpacing } from 'ui/theme'

type SearchAutocompleteProps = UseInfiniteHitsProps & {
  hitComponent: (props: HitProps) => JSX.Element
}

export const SearchAutocomplete = forwardRef(
  <THit extends AlgoliaHit>(
    { hitComponent: Item, ...props }: SearchAutocompleteProps,
    ref: Ref<FlatList<THit>>
  ) => {
    const { hits } = useInfiniteHits(props)
    const contentContainerStyle = { paddingHorizontal: getSpacing(6), paddingTop: getSpacing(4) }

    return (
      <FlatList
        ref={ref}
        contentContainerStyle={contentContainerStyle}
        data={hits as unknown as THit[]}
        keyExtractor={(item) => item.objectID}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        testID="autocompleteList"
        renderItem={({ item, index }) => <Item hit={item as unknown as THit} index={index} />}
      />
    )
  }
)

SearchAutocomplete.displayName = 'SearchAutocomplete'
