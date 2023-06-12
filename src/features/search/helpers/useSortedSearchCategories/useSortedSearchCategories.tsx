import { SearchGroupNameEnumv2 } from 'api/gen'
import { ListCategoryButtonProps } from 'features/search/components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

export type OnPressCategory = (pressedCategory: SearchGroupNameEnumv2) => void

export const useSortedSearchCategories = (
  onPressCategory: OnPressCategory
): ListCategoryButtonProps => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const categories = useAvailableCategories()

  return categories
    .map((category) => ({
      label: searchGroupLabelMapping?.[category.facetFilter] || '',
      Icon: category.icon,
      Illustration: category.illustration,
      onPress() {
        onPressCategory(category.facetFilter)
      },
      baseColor: category.baseColor,
      gradients: category.gradients,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
