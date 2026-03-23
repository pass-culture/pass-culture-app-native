// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

const MARGIN = theme.designSystem.size.spacing.xl
const GUTTER = getSpacing(4)
const MIN_WIDTH = getSpacing(32)

export const getGridTileRatio = (screenWidth: number) => {
  const maxScreenWidth = Math.min(screenWidth, theme.breakpoints.lg)
  const nbrOfTilesToDisplay = Math.floor((maxScreenWidth - 2 * MARGIN) / (MIN_WIDTH + GUTTER))
  const tileWidth =
    (maxScreenWidth - 2 * MARGIN - (nbrOfTilesToDisplay - 1) * GUTTER) / nbrOfTilesToDisplay

  return { tileWidth, nbrOfTilesToDisplay }
}
