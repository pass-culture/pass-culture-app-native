import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Platform } from 'react-native'

export type SuggestionsAnnouncement = { key: string; message: string }

// Group updates from the different indices without announcing intermediate counts.
const ANNOUNCEMENT_DELAY_MS = 200

export function useAnnounceSearchSuggestions(
  announcement: SuggestionsAnnouncement | null,
  enabled: boolean
) {
  const [delivered, setDelivered] = useState<SuggestionsAnnouncement | null>(null)
  const previous = useRef<SuggestionsAnnouncement | null>(null)
  const key = announcement?.key
  const message = announcement?.message

  useEffect(() => {
    if (!enabled || key === undefined || message === undefined) {
      if (!enabled) previous.current = null
      return
    }
    if (previous.current?.key === key) return

    const timeout = setTimeout(() => {
      // Different lists can have the same count and query. Make that update audible too.
      const nextMessage =
        previous.current?.message === message ? `Suggestions mises à jour. ${message}` : message
      const next = { key, message: nextMessage }
      previous.current = next
      setDelivered(next)
      if (Platform.OS !== 'web') {
        AccessibilityInfo.announceForAccessibility(nextMessage)
      }
    }, ANNOUNCEMENT_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [enabled, key, message])

  // Remove an obsolete description immediately, including during loading and after blur.
  return enabled && delivered?.key === key ? (delivered?.message ?? '') : ''
}
