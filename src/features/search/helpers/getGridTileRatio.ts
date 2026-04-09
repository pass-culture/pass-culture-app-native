import { getSpacing } from 'ui/theme'

const MIN_WIDTH = getSpacing(32)

export const getGridTileRatio = ({
  screenWidth,
  margin,
  gutter,
  breakpoint,
}: {
  screenWidth: number
  margin?: number
  gutter?: number
  breakpoint: number
}) => {
  const maxScreenWidth = Math.min(screenWidth, breakpoint)
  const nbrOfTilesToDisplay = Math.floor(
    (maxScreenWidth - 2 * (margin ?? 0)) / (MIN_WIDTH + (gutter ?? 0))
  )
  const tileWidth =
    (maxScreenWidth - 2 * (margin ?? 0) - (nbrOfTilesToDisplay - 1) * (gutter ?? 0)) /
    nbrOfTilesToDisplay

  return { tileWidth, nbrOfTilesToDisplay }
}
