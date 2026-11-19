import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import { isEqual } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-core'

import {
  SearchSuggestionsGroup,
  SearchSuggestionsGroupItem,
} from 'features/search/components/SearchSuggestionsListbox/SearchSuggestionsGroup'
import { SuggestionsSnapshot } from 'features/search/store/searchSuggestionsAccessibility.store'

type Props<T> = {
  title: string
  renderItem: (hit: T, sendEvent: SendEventForHits) => React.ReactNode
  onSuggestionsChange?: (snapshot: SuggestionsSnapshot) => void
} & UseInfiniteHitsProps

export function AutocompleteSection<T>({
  title,
  renderItem,
  onSuggestionsChange,
  ...props
}: Props<T>) {
  const { hits, sendEvent, results } = useInfiniteHits(props)
  const query = results?.query
  const previous = useRef<{
    snapshot: SuggestionsSnapshot
    notify: typeof onSuggestionsChange
  } | null>(null)

  useEffect(() => {
    if (query === undefined) return

    // Include displayed labels as well as ordered IDs, but exclude analytics metadata.
    const itemKeys = hits.map((hit) =>
      JSON.stringify([hit.objectID, hit.query, hit.name, hit.city])
    )
    const snapshot = { query, itemKeys }
    const next = { snapshot, notify: onSuggestionsChange }
    if (isEqual(previous.current, next)) return

    previous.current = next
    onSuggestionsChange?.(snapshot)
  }, [query, hits, onSuggestionsChange])

  if (!hits.length) return null

  return (
    <SearchSuggestionsGroup title={title}>
      {hits.map((item) => (
        <SearchSuggestionsGroupItem key={item.objectID}>
          {renderItem(item as T, sendEvent)}
        </SearchSuggestionsGroupItem>
      ))}
    </SearchSuggestionsGroup>
  )
}
