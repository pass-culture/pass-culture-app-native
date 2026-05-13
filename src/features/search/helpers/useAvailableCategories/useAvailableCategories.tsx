import { hasAThematicSearch } from 'features/navigation/SearchStackNavigator/SearchStackTypes'
import { CategoryCriteria, NewCategoryCriteria } from 'features/search/enums'
import {
  availableCategories,
  newAvailableCategories,
} from 'features/search/helpers/availableCategories/availableCategories'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'

export const useAvailableCategories = (): CategoryCriteria[] | NewCategoryCriteria[] => {
  const { data } = useSubcategoriesQuery()
  const enableNewCategoryBlocks = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_CATEGORY_BLOCKS)

  const searchGroupsEnum = data?.searchGroups.map((searchGroup) => searchGroup.name) ?? []
  const categories = Object.values(
    enableNewCategoryBlocks ? newAvailableCategories : availableCategories
  ).filter((category) => searchGroupsEnum.includes(category.facetFilter))

  return categories
}

export const useAvailableThematicSearchCategories = (): CategoryCriteria[] => {
  return Object.values(availableCategories).filter((category) =>
    hasAThematicSearch.find((thematicSearch) => thematicSearch === category.facetFilter)
  )
}
