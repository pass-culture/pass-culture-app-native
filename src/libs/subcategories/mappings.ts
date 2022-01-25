import { t } from '@lingui/macro'
import { useMemo } from 'react'

import {
  CategoryHomeLabelMapping,
  CategoryIdMapping,
  HomeLabelMapping,
  SearchGroupLabelMapping,
  SubcategoriesMapping,
  SubcategoryLabelMapping,
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
  }, [subcategories.length])
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
  }, [subcategories.length])
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
  }, [subcategories.length])
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
  }, [homepageLabels.length])
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
  }, [subcategories.length, homeLabelMapping])
}

export const useSearchGroupLabelMapping = (): SearchGroupLabelMapping => {
  const { data } = useSubcategories()
  const { searchGroups = [] } = data || {}

  return useMemo(() => {
    const mapping = {} as SearchGroupLabelMapping
    searchGroups.forEach((curr) => {
      mapping[curr.name] = curr.value || t`Toutes les catégories`
    })
    return mapping
  }, [searchGroups.length])
}
