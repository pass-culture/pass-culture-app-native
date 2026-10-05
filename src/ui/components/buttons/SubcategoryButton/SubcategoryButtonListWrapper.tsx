import React, { useMemo } from 'react'
import { useTheme } from 'styled-components/native'

import { ThematicSearchCategories } from 'features/navigation/navigators/SearchStackNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { getSubcategoryButtonContent } from 'ui/components/buttons/SubcategoryButton/helpers'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

type Props = {
  offerCategory: ThematicSearchCategories
}

export const SubcategoryButtonListWrapper: React.FC<Props> = ({ offerCategory }) => {
  const { data: subcategories = PLACEHOLDER_DATA } = useSubcategoriesQuery()
  const { searchState, dispatch } = useSearch()
  const { designSystem } = useTheme()
  const nativeCategories = useNativeCategories(offerCategory)
  const enableNewSubcategoryBlocks = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_CATEGORY_BLOCKS)

  const subcategoryButtonContent = useMemo(
    () =>
      getSubcategoryButtonContent({
        nativeCategories,
        offerCategory,
        subcategories,
        searchState,
        dispatch,
        backgroundColors: enableNewSubcategoryBlocks
          ? designSystem.color.illustration
          : designSystem.color.background,
        borderColors: designSystem.color.border,
        enableNewSubcategoryBlocks,
      }),
    [
      nativeCategories,
      offerCategory,
      subcategories,
      searchState,
      dispatch,
      enableNewSubcategoryBlocks,
      designSystem.color.illustration,
      designSystem.color.background,
      designSystem.color.border,
    ]
  )

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({
      type: 'categories',
      moduleName: 'Tout parcourir',
      from: 'thematicsearch',
    })
  }

  return (
    <SubcategoryButtonList
      subcategoryButtonContent={subcategoryButtonContent}
      seeAllNavigateTo={{
        screen: 'ThematicSearchSubcategories',
        params: { offerCategories: [offerCategory] },
      }}
      onBeforeSeeAllNavigate={onBeforeNavigate}
      enableNewSubcategoryBlocks={enableNewSubcategoryBlocks}
    />
  )
}
