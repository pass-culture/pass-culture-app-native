import React from 'react'
import { ThemeProvider } from 'styled-components/native'

import { useVenueBackgroundStyle } from 'features/venue/helpers/useVenueBackgroundStyle'
import { computedTheme } from 'tests/computedTheme'
import { renderHook } from 'tests/utils'
import { theme } from 'theme'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('useVenueBackgroundStyle', () => {
  it('should return desktop background style', () => {
    const customTheme = { ...theme, ...computedTheme, isDesktopViewport: true }
    const { result } = renderHook(useVenueBackgroundStyle, {
      wrapper: ({ children }) => <ThemeProvider theme={customTheme}>{children}</ThemeProvider>,
    })

    expect(result.current).toEqual({ height: 232, width: 375, borderRadius: 4 })
  })

  it('should return tablet background style', () => {
    const customTheme = {
      ...theme,
      ...computedTheme,
      isDesktopViewport: false,
      isTabletViewport: true,
    }
    const { result } = renderHook(useVenueBackgroundStyle, {
      wrapper: ({ children }) => <ThemeProvider theme={customTheme}>{children}</ThemeProvider>,
    })

    expect(result.current).toEqual({ height: 232, width: 375, borderRadius: 4 })
  })

  it('should return mobile background style', () => {
    const customTheme = { ...theme, ...computedTheme, isDesktopViewport: false }
    const { result } = renderHook(useVenueBackgroundStyle, {
      wrapper: ({ children }) => <ThemeProvider theme={customTheme}>{children}</ThemeProvider>,
    })

    expect(result.current).toEqual({ height: 188, width: 960 })
  })
})
