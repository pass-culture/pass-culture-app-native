/* eslint-disable local-rules/queries-must-be-in-queries-folder */
import { Platform, useWindowDimensions } from 'react-native'

interface MediaQuery {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
}

/**
 * This utils was inspired from react-responsive and @expo/match-media
 * It is lighter, only works with width for now, but it respect react-navigation API,
 * if we ever need to use those later.
 * @param {object} options - This util options
 * @param {number} [options.minWidth] - The breakpoint min viewport width
 * @param {number} [options.maxWidth] - The breakpoint max viewport width
 * @param {number} [options.minHeight] - The breakpoint min viewport height
 * @param {number} [options.maxHeight] - The breakpoint max viewport height
 * @param {string} platform - The platform to target with the media query (otherwise return false)
 */
export function useMediaQuery(
  { minWidth, maxWidth, minHeight, maxHeight }: MediaQuery,
  platform?: 'ios' | 'android' | 'web'
) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  if (platform !== undefined && platform !== Platform.OS) {
    return false
  }

  return getMediaQueryFromDimensions({
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    windowWidth,
    windowHeight,
  })
}

interface Dimensions {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  windowWidth: number
  windowHeight: number
}

export function getMediaQueryFromDimensions({
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  windowWidth,
  windowHeight,
}: Dimensions) {
  if (!minWidth && !maxWidth && !minHeight && !maxHeight) {
    throw new Error(
      `useMediaQuery was used without minWidth, maxWidth, minHeight and maxHeight. At least one is necessary`
    )
  }

  return (
    (minWidth === undefined || minWidth <= windowWidth) &&
    (maxWidth === undefined || windowWidth <= maxWidth) &&
    (minHeight === undefined || minHeight <= windowHeight) &&
    (maxHeight === undefined || windowHeight <= maxHeight)
  )
}
