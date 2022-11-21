import { SearchGroupNameEnumv2 } from 'api/gen'
import { availableCategories } from 'features/search/helpers/availableCategories/availableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

import { ListCategoryButtonProps } from '../../components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'

export type OnPressCategory = (pressedCategory: SearchGroupNameEnumv2) => void

export const useSortedSearchCategories = (
  onPressCategory: OnPressCategory
): ListCategoryButtonProps => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()

  const categories = Array.from(Object.values(availableCategories))
  return categories
    .map((category) => ({
      label: searchGroupLabelMapping[category.facetFilter],
      Icon: category.icon,
      onPress() {
        onPressCategory(category.facetFilter)
      },
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
