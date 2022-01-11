import { ComputedTheme } from 'libs/styled/native/types'
import { theme } from 'theme'

export const computedTheme: Readonly<ComputedTheme> = Object.freeze({
  ...theme,
  isMobileViewport: true,
  isTabletViewport: false,
  isDesktopViewport: false,
  appContentWidth: 960,
})
