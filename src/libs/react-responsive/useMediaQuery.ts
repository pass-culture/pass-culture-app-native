import * as RN from 'react-native'

interface MediaQuery {
  maxWidth?: number
  minWidth?: number
}

/**
 * This utils was inspired from react-responsive and @expo/match-media
 * It is lighter, only works with width for now, but it respect react-navigation API,
 * if we ever need to use those later.
 * @param {number} maxWidth - The breakpoint max viewport width
 * @param {number} minWidth - The breakpoint min viewport width
 */
export function useMediaQuery({ maxWidth, minWidth }: MediaQuery) {
  const { width: windowWidth } = RN.useWindowDimensions()
  if (maxWidth !== undefined && minWidth === undefined) {
    return windowWidth < maxWidth
  } else if (maxWidth === undefined && minWidth !== undefined) {
    return windowWidth > minWidth
  } else if (maxWidth !== undefined && minWidth !== undefined) {
    return windowWidth < maxWidth && windowWidth > minWidth
  }
  return false
}
