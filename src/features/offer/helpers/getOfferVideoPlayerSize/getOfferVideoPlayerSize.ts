import { RATIO169, RATIO916 } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { MAX_HEIGHT_VIDEO_PORTRAIT } from 'features/offer/constant'

type Params = {
  viewportWidth: number
  maxWidth: number
  isPortrait?: boolean
  playerRatio?: number
}

export const getOfferVideoPlayerSize = ({
  viewportWidth,
  maxWidth,
  isPortrait = false,
  playerRatio = RATIO169,
}: Params) => {
  if (isPortrait) {
    const width = Math.min(viewportWidth, MAX_HEIGHT_VIDEO_PORTRAIT / RATIO916)
    return { width, height: width * RATIO916 }
  }

  return {
    width: viewportWidth < maxWidth ? undefined : maxWidth,
    height: Math.min(viewportWidth, maxWidth) * playerRatio,
  }
}
