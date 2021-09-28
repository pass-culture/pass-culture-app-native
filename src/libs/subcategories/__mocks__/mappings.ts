import { placeholderData } from 'libs/subcategories/placeholderData'
import {
  CategoryHomeLabelMapping,
  CategoryIdMapping,
  SubcategoriesMapping,
  HomeLabelMapping,
} from 'libs/subcategories/types'

const { subcategories, homepageLabels } = placeholderData

export const useSubcategoriesMapping = () => {
  const mapping = {} as SubcategoriesMapping
  subcategories.forEach((curr) => {
    const { id, ...subcategory } = curr
    mapping[id] = subcategory
  })
  return mapping
}

export const useCategoryIdMapping = () => {
  const mapping = {} as CategoryIdMapping
  subcategories.forEach((curr) => {
    mapping[curr.id] = curr.categoryId
  })
  return mapping
}

export const useHomeLabelMapping = () => {
  const mapping = {} as HomeLabelMapping
  homepageLabels.forEach((curr) => {
    mapping[curr.name] = curr.value || null
  })
  return mapping
}

export const useCategoryHomeLabelMapping = () => {
  const homeLabelMapping = useHomeLabelMapping()
  const mapping = {} as CategoryHomeLabelMapping
  subcategories.forEach((curr) => {
    mapping[curr.id] = homeLabelMapping[curr.homepageLabelName]
  })
  return mapping
}
