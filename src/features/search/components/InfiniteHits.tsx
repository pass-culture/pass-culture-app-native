import { Hit as AlgoliaHit } from '@algolia/client-search'
import React, { forwardRef } from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import { FlatList } from 'react-native'

import { getSpacing } from 'ui/theme'

type InfiniteHitsProps<THit> = UseInfiniteHitsProps & {
  hitComponent: (props: { hit: THit; index: number }) => JSX.Element
}

export const InfiniteHits = forwardRef(
  <THit extends AlgoliaHit<Record<string, unknown>>>(
    { hitComponent: Hit, ...props }: InfiniteHitsProps<THit>,
    ref: React.ForwardedRef<FlatList<THit>>
  ) => {
    const { hits, isLastPage, showMore } = useInfiniteHits(props)
    const contentContainerStyle = { paddingHorizontal: getSpacing(6), paddingTop: getSpacing(4) }

    return (
      <FlatList
        ref={ref}
        contentContainerStyle={contentContainerStyle}
        data={hits as unknown as THit[]}
        keyExtractor={(item) => item.objectID}
        onEndReached={() => {
          if (!isLastPage) {
            showMore()
          }
        }}
        renderItem={({ item, index }) => <Hit hit={item as unknown as THit} index={index} />}
      />
    )
  }
)

declare module 'react' {
  function forwardRef<T, P = Record<string, unknown>>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}
