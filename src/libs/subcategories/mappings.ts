import { useMemo } from 'react'

import {
  CategoryHomeLabelMapping,
  CategoryIdMapping,
  GenreTypeMapping,
  HomeLabelMapping,
  SearchGroupLabelMapping,
  SubcategoriesMapping,
  SubcategoryLabelMapping,
  SubcategoryOfferLabelMapping,
} from 'libs/subcategories/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export const useSubcategoriesMapping = (): SubcategoriesMapping => {
  const { data } = useSubcategories()
  const { subcategories = [] } = data || {}

  return useMemo(() => {
    const mapping = {} as SubcategoriesMapping
    subcategories.forEach((curr) => {
      const { id, ...subcategory } = curr
      mapping[id] = subcategory
    })
    return mapping
  }, [subcategories])
}

export const useCategoryIdMapping = (): CategoryIdMapping => {
  const { data } = useSubcategories()
  const { subcategories = [] } = data || {}

  return useMemo(() => {
    const mapping = {} as CategoryIdMapping
    subcategories.forEach((curr) => {
      mapping[curr.id] = curr.categoryId
    })
    return mapping
  }, [subcategories])
}

export const useSubcategoryLabelMapping = (): SubcategoryLabelMapping => {
  const { data } = useSubcategories()
  const { subcategories = [] } = data || {}

  return useMemo(() => {
    const mapping = {} as SubcategoryLabelMapping
    subcategories.forEach((curr) => {
      mapping[curr.appLabel] = curr.id
    })
    return mapping
  }, [subcategories])
}

export const useSubcategoryOfferLabelMapping = (): SubcategoryOfferLabelMapping => {
  const { data } = useSubcategories()
  const { subcategories = [] } = data || {}

  return useMemo(() => {
    const mapping = {} as SubcategoryOfferLabelMapping
    subcategories.forEach((curr) => {
      mapping[curr.id] = curr.appLabel
    })
    return mapping
  }, [subcategories])
}

const useHomeLabelMapping = (): HomeLabelMapping => {
  const { data } = useSubcategories()
  const { homepageLabels = [] } = data || {}

  return useMemo(() => {
    const mapping = {} as HomeLabelMapping
    homepageLabels.forEach((curr) => {
      mapping[curr.name] = curr.value || null
    })
    return mapping
  }, [homepageLabels])
}

export const useCategoryHomeLabelMapping = (): CategoryHomeLabelMapping => {
  const homeLabelMapping = useHomeLabelMapping()
  const { data } = useSubcategories()
  const { subcategories = [] } = data || {}

  return useMemo(() => {
    const mapping = {} as CategoryHomeLabelMapping
    subcategories.forEach((curr) => {
      mapping[curr.id] = homeLabelMapping[curr.homepageLabelName]
    })
    return mapping
  }, [subcategories, homeLabelMapping])
}

export const useSearchGroupLabelMapping = (): SearchGroupLabelMapping => {
  const { data } = useSubcategories()
  const { searchGroups = [] } = data || {}

  return useMemo(() => {
    const mapping = {} as SearchGroupLabelMapping
    searchGroups.forEach((curr) => {
      mapping[curr.name] = curr.value || 'Toutes les catégories'
    })
    return mapping
  }, [searchGroups])
}

export const useGenreTypeMapping = (): GenreTypeMapping => {
  const { data } = useSubcategories()
  const { genreTypes = [] } = data || {}

  return useMemo(() => {
    const mapping = {} as GenreTypeMapping
    genreTypes.forEach((genreType) => (mapping[genreType.name] = genreType.values))
    return mapping
  }, [genreTypes])
}
