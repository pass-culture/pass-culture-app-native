import { theme } from 'theme'

const BRAND_OPACITY = 0.7
const SECONDARY_OPACITY = 0.64

export const brandFilter = { color: theme.uniqueColors.brand, opacity: BRAND_OPACITY }
export const secondaryFilter = { color: theme.colors.secondary, opacity: SECONDARY_OPACITY }

export function getMobileColorFilter(index: number) {
  if (index % 4 === 0 || index % 4 === 3) {
    return brandFilter
  }
  return secondaryFilter
}

export function getDesktopColorFilter(index: number) {
  // we define this list of indices (only 3 because there will be 6 blocks max) so that the colors
  // alternate over 4 columns and 2 lines of CategoryBlock components
  const brandFilterIndices = [0, 2, 5]
  if (brandFilterIndices.includes(index)) {
    return brandFilter
  }
  return secondaryFilter
}
