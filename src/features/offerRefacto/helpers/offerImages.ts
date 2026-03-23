import { PORTRAIT_DIMENSIONS, RATIO_PORTRAIT, RATIO_SQUARE } from 'features/offerRefacto/constants'

type Props = {
  currentIndex: number
  direction: 1 | -1
  maxIndex: number
}

export function calculateCarouselIndex({ currentIndex, direction, maxIndex }: Props) {
  const newIndex = currentIndex + direction
  return Math.max(0, Math.min(maxIndex, newIndex))
}

export const computeImageStyle = (
  isMusicSupport: boolean,
  fullWidth: number,
  borderRadius: number
) => {
  const { height, width } = isMusicSupport ? PORTRAIT_DIMENSIONS.music : PORTRAIT_DIMENSIONS.default
  const aspectRatio = isMusicSupport ? RATIO_SQUARE : RATIO_PORTRAIT

  return {
    height,
    width,
    maxWidth: fullWidth,
    aspectRatio,
    borderRadius,
  }
}
