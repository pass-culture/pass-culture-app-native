import React, { useMemo } from 'react'
import { ScrollViewProps, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { NativeCategoryEnum } from 'features/search/types'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

type StyledScrollViewProps = ScrollViewProps & {
  contentContainerStyle?: ViewStyle
}

type Props = {
  offerCategory: SearchGroupNameEnumv2
  scrollViewProps?: StyledScrollViewProps
}

export const SubcategoryButtonListWrapper: React.FC<Props> = ({ offerCategory }) => {
  const { colors } = useTheme()
  const nativeCategories = useNativeCategories(offerCategory)
  const offerCategoryTheme = useMemo(
    () => ({
      backgroundColor: CATEGORY_CRITERIA[offerCategory]?.fillColor,
      borderColor: CATEGORY_CRITERIA[offerCategory]?.borderColor,
    }),
    [offerCategory]
  )

  const subcategoryButtonContent = useMemo(
    () =>
      nativeCategories.map((nativeCategory) => ({
        label: nativeCategory[1].label,
        backgroundColor: offerCategoryTheme.backgroundColor || colors.white,
        borderColor: offerCategoryTheme.borderColor || colors.black,
        nativeCategory: nativeCategory[0] as NativeCategoryEnum,
      })),
    [
      colors.black,
      colors.white,
      nativeCategories,
      offerCategoryTheme.backgroundColor,
      offerCategoryTheme.borderColor,
    ]
  )

  return <SubcategoryButtonList subcategoryButtonContent={subcategoryButtonContent} />
}
