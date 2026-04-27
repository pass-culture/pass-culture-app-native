import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance, Platform } from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { renderHook, waitFor } from 'tests/utils'

import { ColorScheme } from './types'
import { useLogAppThemeStatusOnLaunch } from './useLogAppThemeStatusOnLaunch'

jest.mock('@react-native-async-storage/async-storage')

const getColorSchemeSpy = jest.spyOn(Appearance, 'getColorScheme')

const buildPersistedValue = (colorScheme: ColorScheme) =>
  JSON.stringify({ state: { colorScheme }, version: 0 })

describe('useLogAppThemeStatusOnLaunch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('logs once on mount with persisted SYSTEM scheme and light system theme', async () => {
    jest
      .spyOn(AsyncStorage, 'getItem')
      .mockResolvedValueOnce(buildPersistedValue(ColorScheme.SYSTEM))
    getColorSchemeSpy.mockReturnValueOnce('light')

    renderHook(() => useLogAppThemeStatusOnLaunch())

    await waitFor(() => {
      expect(analytics.logAppThemeStatus).toHaveBeenCalledWith({
        themeSetting: ColorScheme.LIGHT,
        systemTheme: ColorScheme.LIGHT,
        platform: Platform.OS,
      })
    })

    expect(analytics.logAppThemeStatus).toHaveBeenCalledTimes(1)
  })

  it('logs DARK themeSetting when the user has explicitly chosen DARK, regardless of system theme', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(buildPersistedValue(ColorScheme.DARK))
    getColorSchemeSpy.mockReturnValueOnce('light')

    renderHook(() => useLogAppThemeStatusOnLaunch())

    await waitFor(() => {
      expect(analytics.logAppThemeStatus).toHaveBeenCalledWith({
        themeSetting: ColorScheme.DARK,
        systemTheme: ColorScheme.LIGHT,
        platform: Platform.OS,
      })
    })
  })

  it('falls back to SYSTEM when no value is persisted yet (first launch)', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null)
    getColorSchemeSpy.mockReturnValueOnce('dark')

    renderHook(() => useLogAppThemeStatusOnLaunch())

    await waitFor(() => {
      expect(analytics.logAppThemeStatus).toHaveBeenCalledWith({
        themeSetting: ColorScheme.DARK,
        systemTheme: ColorScheme.DARK,
        platform: Platform.OS,
      })
    })
  })

  it('logs systemTheme=LIGHT when Appearance.getColorScheme() returns null', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null)
    getColorSchemeSpy.mockReturnValueOnce(null)

    renderHook(() => useLogAppThemeStatusOnLaunch())

    await waitFor(() => {
      expect(analytics.logAppThemeStatus).toHaveBeenCalledWith({
        themeSetting: ColorScheme.LIGHT,
        systemTheme: ColorScheme.LIGHT,
        platform: Platform.OS,
      })
    })
  })

  it('does not log a second time when the hook re-renders', async () => {
    jest
      .spyOn(AsyncStorage, 'getItem')
      .mockResolvedValueOnce(buildPersistedValue(ColorScheme.LIGHT))
    getColorSchemeSpy.mockReturnValueOnce('light')

    const { rerender } = renderHook(() => useLogAppThemeStatusOnLaunch())

    await waitFor(() => {
      expect(analytics.logAppThemeStatus).toHaveBeenCalledTimes(1)
    })

    rerender({})
    rerender({})

    expect(analytics.logAppThemeStatus).toHaveBeenCalledTimes(1)
  })
})
