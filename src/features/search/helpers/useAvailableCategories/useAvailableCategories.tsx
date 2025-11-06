import { hasAThematicSearch } from 'features/navigation/SearchStackNavigator/SearchStackTypes'
import { CategoryCriteria } from 'features/search/enums'
import { availableCategories } from 'features/search/helpers/availableCategories/availableCategories'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'

export const useAvailableCategories = (): CategoryCriteria[] => {
  const { data } = useSubcategoriesQuery()
  const searchGroupsEnum = data?.searchGroups.map((searchGroup) => searchGroup.name) ?? []
  const categories = Object.values(availableCategories).filter((category) =>
    searchGroupsEnum.includes(category.facetFilter)
  )

  return categories
}

export const useAvailableThematicSearchCategories = (): CategoryCriteria[] => {
  return Object.values(availableCategories).filter((category) =>
    hasAThematicSearch.find((thematicSearch) => thematicSearch === category.facetFilter)
  )
}
