import { useIsFocused } from '@react-navigation/native'
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react'

import { SearchSuggestionsStatus } from 'features/search/components/SearchSuggestionsStatus/SearchSuggestionsStatus'
import {
  SuggestionsAnnouncement,
  useAnnounceSearchSuggestions,
} from 'features/search/helpers/useAnnounceSearchSuggestions'

export type SuggestionsSnapshot = { query: string; itemKeys: string[] }
export type SuggestionsStatus = SuggestionsAnnouncement & { query: string; ready: boolean }

type Context = {
  descriptionId: string
  setInputFocused: (focused: boolean) => void
  publish: React.Dispatch<React.SetStateAction<SuggestionsStatus | null>>
}

const SuggestionsAccessibilityContext = createContext<Context | null>(null)

export function SearchSuggestionsAccessibilityProvider({
  children,
  query,
  visible,
}: PropsWithChildren<{ query: string; visible: boolean }>) {
  const descriptionId = useId()
  const screenFocused = useIsFocused()
  const [inputFocused, setInputFocused] = useState(false)
  const [status, setStatus] = useState<SuggestionsStatus | null>(null)
  const [hasOpened, setHasOpened] = useState(visible)
  if (visible && !hasOpened) setHasOpened(true)

  let announcement: SuggestionsAnnouncement | null = null
  if (!visible && hasOpened) {
    announcement = { key: 'closed', message: 'Suggestions masquées.' }
  } else if (visible && inputFocused && status?.ready && status.query === query) {
    announcement = status
  }
  const message = useAnnounceSearchSuggestions(
    announcement,
    screenFocused && (inputFocused || !visible)
  )

  const context = useMemo(
    () => ({ descriptionId, setInputFocused, publish: setStatus }),
    [descriptionId]
  )

  return (
    <SuggestionsAccessibilityContext.Provider value={context}>
      {children}
      <SearchSuggestionsStatus id={descriptionId} message={message} />
    </SuggestionsAccessibilityContext.Provider>
  )
}

export const useSearchSuggestionsAccessibility = () => useContext(SuggestionsAccessibilityContext)
