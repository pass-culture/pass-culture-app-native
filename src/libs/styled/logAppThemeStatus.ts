import { Appearance, Platform } from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'

import { getResolvedColorScheme } from './getResolvedColorScheme'
import { ColorScheme } from './types'
import { getPersistedColorScheme } from './useColorScheme'

export const logAppThemeStatus = async () => {
  try {
    const persistedColorScheme = await getPersistedColorScheme()
    const systemColorScheme = Appearance.getColorScheme()
    const themeSetting = getResolvedColorScheme(persistedColorScheme, systemColorScheme)
    const systemTheme = systemColorScheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT

    await analytics.logAppThemeStatus({ themeSetting, systemTheme, platform: Platform.OS })
  } catch (error) {
    eventMonitoring.captureException(error, { extra: { feature: 'logAppThemeStatus' } })
  }
}
