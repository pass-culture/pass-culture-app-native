import { SearchGroupNameEnumv2 } from 'api/gen'
import { ListCategoryButtonProps } from 'features/search/components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'
import { CategoryButtonProps } from 'features/search/components/CategoryButton/CategoryButton'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

export type OnPressCategory = (pressedCategory: SearchGroupNameEnumv2) => void

export type MappingOutput = CategoryButtonProps & { position: number | undefined }

export function categoriesSortPredicate(a: MappingOutput, b: MappingOutput): number {
  const positionA: number = a?.position || 0
  const positionB: number = b?.position || 0
  return positionA - positionB
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
      textColor: category.textColor,
      borderColor: category.borderColor,
      fillColor: category.fillColor,
    }))
    .sort(categoriesSortPredicate)
}
