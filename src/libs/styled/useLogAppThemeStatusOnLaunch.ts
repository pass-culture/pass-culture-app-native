import { useEffect, useRef } from 'react'
import { Appearance, Platform } from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'

import { getResolvedColorScheme } from './getResolvedColorScheme'
import { ColorScheme } from './types'
import { getPersistedColorScheme } from './useColorScheme'

const logAppThemeStatusOnLaunch = async () => {
  const persistedColorScheme = await getPersistedColorScheme()
  const systemColorScheme = Appearance.getColorScheme()
  const themeSetting = getResolvedColorScheme(persistedColorScheme, systemColorScheme)
  const systemTheme = systemColorScheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT

  await analytics.logAppThemeStatus({ themeSetting, systemTheme, platform: Platform.OS })
}

export const useLogAppThemeStatusOnLaunch = () => {
  const hasLogged = useRef(false)

  useEffect(() => {
    if (hasLogged.current) return
    hasLogged.current = true

    logAppThemeStatusOnLaunch().catch((error) => {
      eventMonitoring.captureException(error, {
        extra: { feature: 'logAppThemeStatusOnLaunch' },
      })
    })
  }, [])
}
