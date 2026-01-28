import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'

const DARK_MODE_GTM_APPEARANCE_TAG_KEY = 'darkModeGtmAppearanceTagSeen'

export function useAppearanceTag(enableDarkModeGtm: boolean) {
  const [hasSeenAppearanceTag, setHasSeenAppearanceTag] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchTagState() {
      if (!enableDarkModeGtm) {
        setHasSeenAppearanceTag(null)
        return
      }

      const stored = await AsyncStorage.getItem(DARK_MODE_GTM_APPEARANCE_TAG_KEY)
      if (mounted) {
        setHasSeenAppearanceTag(stored === 'true')
      }
    }

    fetchTagState()
    return () => {
      mounted = false
    }
  }, [enableDarkModeGtm])

  const markAppearanceTagSeen = useCallback(() => {
    setHasSeenAppearanceTag(true)
    AsyncStorage.setItem(DARK_MODE_GTM_APPEARANCE_TAG_KEY, 'true').catch(() => null)
  }, [])

  return {
    hasSeenAppearanceTag,
    markAppearanceTagSeen,
  }
}
