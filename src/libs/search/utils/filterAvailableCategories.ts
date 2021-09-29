import { SearchGroupNameEnum } from 'api/gen'
import { CategoryCriteria } from 'features/search/enums'

export const filterAvailableCategories = (
  selectedCategories: SearchGroupNameEnum[],
  availableCategories: Partial<CategoryCriteria>
): SearchGroupNameEnum[] => {
  const availableFilters = Object.values(availableCategories).map(({ facetFilter }) => facetFilter)
  return availableFilters
    .filter((facetFilter) => selectedCategories.includes(facetFilter))
    .sort((a: SearchGroupNameEnum, b: SearchGroupNameEnum) => a.localeCompare(b))
}
