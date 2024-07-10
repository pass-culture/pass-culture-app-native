import { useRoute } from '@react-navigation/native'
import React, { useMemo } from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { CATEGORY_CRITERIA, Gradient } from 'features/search/enums'
import { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { SearchN1Bar } from 'features/search/pages/Search/SearchN1Books/SearchN1Bar'
import { NativeCategoryEnum } from 'features/search/types'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

export const SearchN1Books = () => {
  const { params } = useRoute<UseRouteType<SearchStackRouteName>>()

  const offerCategories = params?.offerCategories as SearchGroupNameEnumv2[]
  const offerCategory = offerCategories[0] || SearchGroupNameEnumv2.LIVRES

  const nativeCategories = useNativeCategories(offerCategory)
  const colorsGradients = CATEGORY_CRITERIA[offerCategory]?.gradients as Gradient

  const subCategoriesContent = useMemo(
    () =>
      nativeCategories.map((nativeCategory) => ({
        label: nativeCategory[1].label,
        colors: colorsGradients,
        nativeCategory: nativeCategory[0] as NativeCategoryEnum,
      })),
    [colorsGradients, nativeCategories]
  )

  return (
    <SearchN1Bar offerCategories={offerCategories}>
      <SubcategoryButtonList subcategoryButtonContent={subCategoriesContent} />
    </SearchN1Bar>
  )
}
