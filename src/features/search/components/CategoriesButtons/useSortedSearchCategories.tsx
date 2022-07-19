import { SearchGroupNameEnum } from 'api/gen'
import { availableCategories } from 'features/search/utils/availableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

import { ListCategoryButtonProps } from './CategoriesButtonsDisplay'

export type OnCategoryPress = (pressedCategory: SearchGroupNameEnum) => void

export const useSortedSearchCategories = (
  onCategoryPress: OnCategoryPress
): ListCategoryButtonProps => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()

  const categories = Array.from(Object.values(availableCategories))
  return categories
    .map((category) => ({
      label: searchGroupLabelMapping[category.facetFilter],
      Icon: category.icon,
      onPress() {
        onCategoryPress(category.facetFilter)
      },
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
