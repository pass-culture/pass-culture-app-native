import { SearchGroupNameEnumv2 } from 'api/gen'
import { ListCategoryButtonProps } from 'features/search/components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'
import { CategoryButtonProps } from 'features/search/components/CategoryButton/CategoryButton'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

export type OnPressCategory = (pressedCategory: SearchGroupNameEnumv2) => void

export type MappingOutput = CategoryButtonProps & { position: number | undefined }

export function categoriesSortPredicate(a: MappingOutput, b: MappingOutput): number {
  if (a.position === undefined) return 0
  if (b.position === undefined) return 0
  return a.position - b.position
}

export const useSortedSearchCategories = (
  onPressCategory: OnPressCategory
): ListCategoryButtonProps => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const categories = useAvailableCategories()

  return categories
    .map<MappingOutput>((category) => ({
      label: searchGroupLabelMapping?.[category.facetFilter] || '',
      Icon: category.icon,
      Illustration: category.illustration,
      onPress() {
        onPressCategory(category.facetFilter)
      },
      baseColor: category.baseColor,
      gradients: category.gradients,
      position: category.position,
    }))
    .sort(categoriesSortPredicate)
}
