import { RATIO169, RATIO916 } from 'features/home/components/helpers/getVideoPlayerDimensions'

type PortraitParams = {
  isPortrait: true
  viewportWidth: number
  maxWidth: number
  horizontalMargin?: number
  maxHeight?: number
}

type LandscapeParams = {
  isPortrait?: false
  viewportWidth: number
  maxWidth: number
  playerRatio?: number
}

type Params = PortraitParams | LandscapeParams

export const getOfferVideoPlayerSize = (params: Params) => {
  const { viewportWidth, maxWidth } = params

  if (params.isPortrait) {
    const { horizontalMargin = 0, maxHeight } = params
    const availableWidth = Math.min(viewportWidth - 2 * horizontalMargin, maxWidth)
    const heightConstrainedWidth = maxHeight === undefined ? availableWidth : maxHeight / RATIO916
    const width = Math.max(0, Math.min(availableWidth, heightConstrainedWidth))

    return { width, height: width * RATIO916 }
  }

  const { playerRatio = RATIO169 } = params

  return {
    width: viewportWidth < maxWidth ? undefined : maxWidth,
    height: Math.min(viewportWidth, maxWidth) * playerRatio,
  }
}
