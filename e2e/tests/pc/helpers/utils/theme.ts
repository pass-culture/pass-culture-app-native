import { flags } from './platform'

export type DefaultTheme = {
  isTouch: boolean
  breakpoints: {
    md: number
    lg: number
  }
  tabBar: {
    labelMinScreenWidth: number
    showLabels: boolean
  }
  isMobileViewport: boolean
  isTabletViewport: boolean
  isDesktopViewport: boolean
  isSmallScreen: boolean
  showTabBar: boolean
  appContentWidth: number
}

export function getTheme({
  width: windowWidth,
  height: windowHeight,
}: {
  width: number
  height: number
}): DefaultTheme {
  const isTouch = driver.isAndroid || driver.isIOS
  const breakpoints = {
    md: 960,
    lg: 1024,
  }
  const tabletMinWidth = breakpoints.md
  const desktopMinWidth = breakpoints.lg
  const minScreenHeight = 568
  const labelMinScreenWidth = 375

  const isMobileViewport = windowWidth <= tabletMinWidth
  const isTabletViewport = windowWidth >= tabletMinWidth && windowWidth <= desktopMinWidth
  const isDesktopViewport = windowWidth >= desktopMinWidth
  const isSmallScreen = windowHeight <= minScreenHeight
  const showLabels = windowWidth >= labelMinScreenWidth
  const showTabBar = flags.isIOS || flags.isAndroid || isMobileViewport
  const appContentWidth = Math.min(desktopMinWidth, windowWidth)

  return {
    isTouch,
    breakpoints,
    tabBar: {
      labelMinScreenWidth,
      showLabels,
    },
    isMobileViewport,
    isTabletViewport,
    isDesktopViewport,
    isSmallScreen,
    showTabBar,
    appContentWidth,
  }
}
