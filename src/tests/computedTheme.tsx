import { ComputedTheme } from 'libs/styled/ThemeProvider'
import { theme } from 'theme'

export const computedTheme: Readonly<ComputedTheme> = Object.freeze({
  ...theme,
  isMobileViewport: true,
  isTabletViewport: false,
  isDesktopViewport: false,
  appContentWidth: 960,
})
