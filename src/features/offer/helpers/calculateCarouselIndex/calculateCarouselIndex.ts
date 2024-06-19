type Props = {
  currentIndex: number
  direction: 1 | -1
  maxIndex: number
}

export function calculateCarouselIndex({ currentIndex, direction, maxIndex }: Props) {
  const newIndex = currentIndex + direction
  return Math.max(0, Math.min(maxIndex, newIndex))
}
