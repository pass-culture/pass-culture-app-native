import { CATEGORY_CRITERIA } from 'features/search/enums'

export const getCategoriesFacetFilters = (categoryLabel: string): string => {
  const category = Object.values(CATEGORY_CRITERIA).find(({ label }) => label === categoryLabel)
  return category ? category.facetFilter : ''
}
