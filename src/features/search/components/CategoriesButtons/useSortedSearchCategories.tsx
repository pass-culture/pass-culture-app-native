import { SearchGroupNameEnum } from 'api/gen'
import { availableCategories } from 'features/search/utils/availableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

import { ListCategoryButtonProps } from './CategoriesButtonsDisplay'

export const makeDisplaySearchResultsWithCategory = (_facetFilter: SearchGroupNameEnum) => () =>
  alert('le click sera fonctionnel lorsque cette US PC-15130 sera fini')

export const useSortedSearchCategories = (): ListCategoryButtonProps => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()

  const categories = Array.from(Object.values(availableCategories))
  return categories
    .map((category) => ({
      label: searchGroupLabelMapping[category.facetFilter],
      Icon: category.icon,
      onPress: makeDisplaySearchResultsWithCategory(category.facetFilter),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
