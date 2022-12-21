import { theme } from 'theme'

const BRAND_OPACITY = 0.7
const SECONDARY_OPACITY = 0.64

export const brandFilter = { color: theme.uniqueColors.brand, opacity: BRAND_OPACITY }
export const secondaryFilter = { color: theme.colors.secondary, opacity: SECONDARY_OPACITY }

export function getColorFilter(index: number) {
  if (index % 4 === 0 || index % 4 === 3) {
    return brandFilter
  }
  return secondaryFilter
}
