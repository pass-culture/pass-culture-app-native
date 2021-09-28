import { placeholderData } from 'libs/subcategories/placeholderData'
import { CategoryIdMapping, SubcategoriesMapping } from 'libs/subcategories/types'

export const useSubcategoriesMapping = () => {
  const mapping = {} as SubcategoriesMapping
  placeholderData.subcategories.forEach((curr) => {
    const { id, ...subcategory } = curr
    mapping[id] = subcategory
  })
  return mapping
}

export const useCategoryIdMapping = () => {
  const mapping = {} as CategoryIdMapping
  placeholderData.subcategories.forEach((curr) => {
    mapping[curr.id] = curr.categoryId
  })
  return mapping
}
