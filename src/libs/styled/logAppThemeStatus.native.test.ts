import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance, Platform } from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'

import { logAppThemeStatus } from './logAppThemeStatus'
import { ColorScheme } from './types'

jest.mock('@react-native-async-storage/async-storage')

const getColorSchemeSpy = jest.spyOn(Appearance, 'getColorScheme')

const buildPersistedValue = (colorScheme: ColorScheme) =>
  JSON.stringify({ state: { colorScheme }, version: 0 })

describe('logAppThemeStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('logs with persisted SYSTEM scheme and light system theme', async () => {
    jest
      .spyOn(AsyncStorage, 'getItem')
      .mockResolvedValueOnce(buildPersistedValue(ColorScheme.SYSTEM))
    getColorSchemeSpy.mockReturnValueOnce('light')

    await logAppThemeStatus()

    expect(analytics.logAppThemeStatus).toHaveBeenCalledWith({
      themeSetting: ColorScheme.LIGHT,
      systemTheme: ColorScheme.LIGHT,
      platform: Platform.OS,
    })
  })

  it('logs DARK themeSetting when the user has explicitly chosen DARK, regardless of system theme', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(buildPersistedValue(ColorScheme.DARK))
    getColorSchemeSpy.mockReturnValueOnce('light')

    await logAppThemeStatus()

    expect(analytics.logAppThemeStatus).toHaveBeenCalledWith({
      themeSetting: ColorScheme.DARK,
      systemTheme: ColorScheme.LIGHT,
      platform: Platform.OS,
    })
  })

  it('falls back to SYSTEM when no value is persisted yet (first launch)', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null)
    getColorSchemeSpy.mockReturnValueOnce('dark')

    await logAppThemeStatus()

    expect(analytics.logAppThemeStatus).toHaveBeenCalledWith({
      themeSetting: ColorScheme.DARK,
      systemTheme: ColorScheme.DARK,
      platform: Platform.OS,
    })
  })

  it('logs systemTheme=LIGHT when Appearance.getColorScheme() returns null', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null)
    getColorSchemeSpy.mockReturnValueOnce(null)

    await logAppThemeStatus()

    expect(analytics.logAppThemeStatus).toHaveBeenCalledWith({
      themeSetting: ColorScheme.LIGHT,
      systemTheme: ColorScheme.LIGHT,
      platform: Platform.OS,
    })
  })

  it('captures errors via eventMonitoring instead of throwing', async () => {
    const error = new Error('analytics down')
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null)
    getColorSchemeSpy.mockReturnValueOnce('light')
    ;(analytics.logAppThemeStatus as jest.Mock).mockRejectedValueOnce(error)

    await expect(logAppThemeStatus()).resolves.toBeUndefined()
    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, {
      extra: { feature: 'logAppThemeStatus' },
    })
  })
})
