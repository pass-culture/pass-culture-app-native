import React, { useMemo } from 'react'
import { SafeAreaView } from 'react-native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA, Gradient } from 'features/search/enums'
import { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
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
    <SafeAreaView>
      <SubcategoryButtonList subcategoryButtonContent={bookSubcategoriesContent} />
    </SafeAreaView>
  )
}
