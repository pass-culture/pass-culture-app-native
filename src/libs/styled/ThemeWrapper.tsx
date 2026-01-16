import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useRef } from 'react'
import { useColorScheme as useSystemColorScheme } from 'react-native'

import { getPlatformLabel } from 'libs/analytics/getPlatformLabel'
import { analytics } from 'libs/analytics/provider'
import { ThemeProvider } from 'libs/styled'
import {
  ColorScheme,
  getResolvedColorScheme,
  useColorScheme,
  useStoredColorScheme,
} from 'libs/styled/useColorScheme'
// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'

const COLOR_SCHEME_STORAGE_KEY = 'colorScheme'

const parseStoredColorScheme = (storedValue: string | null): ColorScheme | null => {
  if (!storedValue) return null
  try {
    const parsed = JSON.parse(storedValue) as { state?: { colorScheme?: ColorScheme } }
    const scheme = parsed?.state?.colorScheme
    if (
      scheme === ColorScheme.LIGHT ||
      scheme === ColorScheme.DARK ||
      scheme === ColorScheme.SYSTEM
    ) {
      return scheme
    }
  } catch {
    return null
  }
  return null
}

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme()
  const storedColorScheme = useStoredColorScheme()
  const systemScheme = useSystemColorScheme()
  const hasLoggedThemeOnLaunch = useRef(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    if (hasLoggedThemeOnLaunch.current) return

    const logThemeOnLaunch = async () => {
      const storedValue = await AsyncStorage.getItem(COLOR_SCHEME_STORAGE_KEY)
      const persistedColorScheme = parseStoredColorScheme(storedValue)
      if (!isMountedRef.current) return
      const themeSetting = getResolvedColorScheme(
        persistedColorScheme ?? storedColorScheme ?? ColorScheme.SYSTEM,
        systemScheme
      )
      const systemTheme = systemScheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT
      const platform = getPlatformLabel()
      void analytics.logAppThemeStatus({ themeSetting, systemTheme, platform })
      hasLoggedThemeOnLaunch.current = true
    }

    void logThemeOnLaunch()

    return () => {
      isMountedRef.current = false
    }
  }, [storedColorScheme, systemScheme])

  return (
    <ThemeProvider theme={theme} colorScheme={colorScheme}>
      {children}
    </ThemeProvider>
  )
}
