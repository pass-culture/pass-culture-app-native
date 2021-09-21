import { OptionalCategoryCriteria } from 'features/search/enums'

export const filterAvailableCategories = (
  selectedCategories: string[],
  availableCategories: OptionalCategoryCriteria
): string[] => {
  return Object.values(availableCategories)
    .filter((categoryCriterion) => selectedCategories.includes(categoryCriterion.label))
    .map((categoryCriterion) => categoryCriterion.facetFilter)
    .sort((a: string, b: string) => a.localeCompare(b))
}
