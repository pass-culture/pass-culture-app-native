import * as RN from 'react-native'

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
  const { width: windowWidth, height: windowHeight } = RN.useWindowDimensions()
  if (platform !== undefined && platform !== RN.Platform.OS) {
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
  let mq = undefined
  const hasWidthMq = !!(minWidth || maxWidth)
  const hasHeightMq = !!(minHeight || maxHeight)

  if (hasWidthMq) {
    if (maxWidth !== undefined && minWidth === undefined) {
      mq = windowWidth <= maxWidth
    } else if (maxWidth === undefined && minWidth !== undefined) {
      mq = windowWidth >= minWidth
    } else if (maxWidth !== undefined && minWidth !== undefined) {
      mq = windowWidth <= maxWidth && windowWidth >= minWidth
    } else {
      if (!hasHeightMq) {
        throw new Error(
          `useMediaQuery was used without minWidth, maxWidth, minHeight and maxHeight. At least one is necessary`
        )
      }
    }
  }

  if (hasHeightMq) {
    if (maxHeight !== undefined && minHeight === undefined) {
      if (!hasWidthMq || mq === undefined || mq) {
        mq = windowHeight <= maxHeight
      }
    } else if (maxHeight === undefined && minHeight !== undefined) {
      if (!hasWidthMq || mq === undefined || mq) {
        mq = windowHeight >= windowHeight
      }
    } else if (maxHeight !== undefined && minHeight !== undefined) {
      if (!hasWidthMq || mq === undefined || mq) {
        mq = windowHeight <= maxHeight && windowHeight >= minHeight
      }
    }
  }

  return mq
}
