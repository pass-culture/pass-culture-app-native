import { DefaultTheme } from 'styled-components/native'

export type Computed = {
  isMobileViewport?: boolean
  isTabletViewport?: boolean
  isDesktopViewport?: boolean
  showTabBar: boolean
  appContentWidth: number
}

export type ComputedTheme = DefaultTheme & Computed
