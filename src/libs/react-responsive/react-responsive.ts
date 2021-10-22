import * as RN from 'react-native'

interface MediaQuery {
  maxWidth?: number
  minWidth?: number
}

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
