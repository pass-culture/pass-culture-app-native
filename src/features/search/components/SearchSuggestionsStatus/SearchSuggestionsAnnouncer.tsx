import React from 'react'

import { SearchSuggestionsStatus } from 'features/search/components/SearchSuggestionsStatus/SearchSuggestionsStatus'
import { useSearchSuggestionsAnnouncement } from 'features/search/helpers/useSearchSuggestionsAccessibility'

export function SearchSuggestionsAnnouncer({
  id,
  query,
  visible,
}: {
  id: string
  query: string
  visible: boolean
}) {
  const message = useSearchSuggestionsAnnouncement(id, query, visible)
  return <SearchSuggestionsStatus id={id} message={message} />
}
