import { useIsFocused } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'

import {
  SuggestionsAnnouncement,
  useAnnounceSearchSuggestions,
} from 'features/search/helpers/useAnnounceSearchSuggestions'
import {
  searchSuggestionsAccessibilityStore,
  SuggestionsStatus,
} from 'features/search/store/searchSuggestionsAccessibility.store'

export function useSearchSuggestionsAccessibility(descriptionId?: string) {
  const setInputFocused = useCallback(
    (focused: boolean) => {
      if (descriptionId)
        searchSuggestionsAccessibilityStore.actions.setInputFocused(descriptionId, focused)
    },
    [descriptionId]
  )
  const publish = useCallback(
    (status: SuggestionsStatus | null) => {
      if (descriptionId) searchSuggestionsAccessibilityStore.actions.publish(descriptionId, status)
    },
    [descriptionId]
  )
  return { descriptionId, setInputFocused, publish }
}

export function useSearchSuggestionsAnnouncement(id: string, query: string, visible: boolean) {
  const screenFocused = useIsFocused()
  const { inputFocused, status } = searchSuggestionsAccessibilityStore.hooks.useInstance(id)
  const [hasOpened, setHasOpened] = useState(visible)
  if (visible && !hasOpened) setHasOpened(true)

  useEffect(() => () => searchSuggestionsAccessibilityStore.actions.remove(id), [id])

  let announcement: SuggestionsAnnouncement | null = null
  if (!visible && hasOpened) {
    announcement = { key: 'closed', message: 'Suggestions masquées.' }
  } else if (visible && inputFocused && status?.ready && status.query === query) {
    announcement = status
  }
  return useAnnounceSearchSuggestions(announcement, screenFocused && (inputFocused || !visible))
}
