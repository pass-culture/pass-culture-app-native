import { placeholderData } from 'libs/subcategories/placeholderData'
import {
  CategoryHomeLabelMapping,
  CategoryIdMapping,
  SearchGroupLabelMapping,
  SubcategoriesMapping,
  HomeLabelMapping,
  SubcategoryLabelMapping,
  GenreTypeMapping,
} from 'libs/subcategories/types'

const { subcategories, searchGroups, homepageLabels, genreTypes } = placeholderData

export const useSubcategoriesMapping = () => {
  const mapping = {} as SubcategoriesMapping
  subcategories.forEach((curr) => {
    const { id, ...subcategory } = curr
    mapping[id] = subcategory
  })
  return mapping
}

export const useSubcategoryLabelMapping = (): SubcategoryLabelMapping => {
  const mapping = {} as SubcategoryLabelMapping
  subcategories.forEach((curr) => {
    mapping[curr.appLabel] = curr.id
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

const useHomeLabelMapping = () => {
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

export const useSearchGroupLabelMapping = () => {
  const mapping = {} as SearchGroupLabelMapping
  searchGroups.forEach((curr) => {
    mapping[curr.name] = curr.value || `Toutes les catégories`
  })
  return mapping
}

export const useGenreTypeMapping = () => {
  const mapping = {} as GenreTypeMapping
  genreTypes.forEach((curr) => {
    mapping[curr.name] = curr.values
  })
  return mapping
}
