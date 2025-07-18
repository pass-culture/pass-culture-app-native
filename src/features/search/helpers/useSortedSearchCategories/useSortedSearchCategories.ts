import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { getSearchPropConfig } from 'features/navigation/SearchStackNavigator/getSearchPropConfig'
import { useSearch } from 'features/search/context/SearchWrapper'
import { isOnlyOnline } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { useHasAThematicPageList } from 'features/search/helpers/useHasAThematicPageList/useHasAThematicPageList'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { CategoryButtonProps } from 'shared/categoryButton/CategoryButton'
import { BackgroundColorKey, BorderColorKey } from 'theme/types'

export type MappingOutput = Pick<
  CategoryButtonProps,
  'label' | 'navigateTo' | 'onBeforeNavigate' | 'height' | 'style'
> & {
  position: number | undefined
  fillColor: BackgroundColorKey
  borderColor: BorderColorKey
}

export type ListCategoryButtonProps = MappingOutput[]

export function categoriesSortPredicate(a: MappingOutput, b: MappingOutput): number {
  const positionA: number = a?.position || 0
  const positionB: number = b?.position || 0
  return positionA - positionB
}

export const useSortedSearchCategories = (): ListCategoryButtonProps => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const categories = useAvailableCategories()
  const { data } = useSubcategories()
  const hasAThematicSearch = useHasAThematicPageList()
  const { searchState, dispatch } = useSearch()
  const navigateTo = (facetFilter: SearchGroupNameEnumv2) => {
    const searchTabConfig = getSearchPropConfig(
      hasAThematicSearch.includes(facetFilter) ? 'ThematicSearch' : 'SearchResults',
      {
        offerCategories: [facetFilter],
        isFullyDigitalOffersCategory: data && isOnlyOnline(data, facetFilter),
        searchId: uuidv4(),
      }
    )
    return searchTabConfig
  }

  const onBeforeNavigate = (facetFilter: SearchGroupNameEnumv2) => {
    dispatch({
      type: 'SET_STATE',
      payload: { ...searchState, offerCategories: [facetFilter] },
    }) // we'd rather have it in url params but URL is not the only source of truth. When it is, this dispatch should be removed.
  }
  return categories
    .map<MappingOutput>((category) => ({
      label: searchGroupLabelMapping?.[category.facetFilter] || '',
      navigateTo: navigateTo(category.facetFilter),
      onBeforeNavigate: () => onBeforeNavigate(category.facetFilter),
      position: category.position,
      borderColor: category.borderColor,
      fillColor: category.fillColor,
    }))
    .sort(categoriesSortPredicate)
}
