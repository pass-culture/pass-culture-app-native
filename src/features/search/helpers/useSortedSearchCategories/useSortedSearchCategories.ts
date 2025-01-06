import {
  CategoryButtonProps,
  ListCategoryButtonProps,
} from 'features/search/components/CategoriesListDumb/CategoriesListDumb'
import { CATEGORY_APPEARANCE } from 'features/search/enums'
import {
  CategoryKey,
  getTopLevelCategories,
  sortCategoriesPredicate,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'

export type OnPressCategory = (pressedCategory: CategoryKey) => void

export type MappingOutput = CategoryButtonProps & { position: number | undefined }

export const useSortedSearchCategories = (
  onPressCategory: OnPressCategory
): ListCategoryButtonProps => {
  const categories = getTopLevelCategories()

  return categories
    .toSorted(sortCategoriesPredicate)
    .map<MappingOutput | undefined>((category) => {
      const appearance = CATEGORY_APPEARANCE[category.key]
      if (!appearance) return undefined
      return {
        label: category.label,
        Illustration: appearance.illustration,
        onPress() {
          onPressCategory(category.key)
        },
        baseColor: appearance.baseColor,
        gradients: appearance.gradients,
        position: category.position,
        textColor: appearance.textColor,
        borderColor: appearance.borderColor,
        fillColor: appearance.fillColor,
      }
    })
    .filter((mappingOutput) => !!mappingOutput)
}
