import { SearchGroupNameEnumv2 } from 'api/gen'
import { CategoryCriteria } from 'features/search/enums'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export const useAvailableCategories = (
  availableCategories: Omit<CategoryCriteria, SearchGroupNameEnumv2.NONE>
) => {
  const { data } = useSubcategories()
  const searchGroupsEnum = data?.searchGroups.map((searchGroup) => searchGroup.name) ?? []
  const categories = Array.from(Object.values(availableCategories)).filter((category) =>
    searchGroupsEnum.includes(category.facetFilter)
  )

  return categories
}
