import { useMemo } from 'react'

import { SubcategoriesMapping } from 'libs/subcategories/types'
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
