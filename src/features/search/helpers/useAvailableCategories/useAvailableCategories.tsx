import { availableCategories } from 'features/search/helpers/availableCategories/availableCategories'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export const useAvailableCategories = () => {
  const { data } = useSubcategories()
  const searchGroupsEnum = data?.searchGroups.map((searchGroup) => searchGroup.name) || []
  const categories = Array.from(Object.values(availableCategories)).filter((category) =>
    searchGroupsEnum.includes(category.facetFilter)
  )

  return categories
}
