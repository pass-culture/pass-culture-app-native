import React, { useMemo } from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA, Gradient } from 'features/search/enums'
import { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { SearchN1Bar } from 'features/search/pages/Search/SearchN1Books/SearchN1Bar'
import { NativeCategoryEnum } from 'features/search/types'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

export const SearchN1Books = () => {
  const bookNativeCategories = useNativeCategories(SearchGroupNameEnumv2.LIVRES)
  const bookColorsGradients: Gradient = CATEGORY_CRITERIA[SearchGroupNameEnumv2.LIVRES]?.gradients

  const bookSubcategoriesContent = useMemo(
    () =>
      bookNativeCategories.map((bookNativeCategory) => ({
        label: bookNativeCategory[1].label,
        colors: bookColorsGradients,
        nativeCategory: bookNativeCategory[0] as NativeCategoryEnum,
      })),
    [bookColorsGradients, bookNativeCategories]
  )

  return (
    <SearchN1Bar>
      <SubcategoryButtonList subcategoryButtonContent={bookSubcategoriesContent} />
    </SearchN1Bar>
  )
}
