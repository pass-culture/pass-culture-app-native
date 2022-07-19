import React, { FunctionComponent, useCallback } from 'react'

import { analytics } from 'libs/firebase/analytics'

import { CategoriesButtonsDisplay } from './CategoriesButtonsDisplay'
import { OnCategoryPress, useSortedSearchCategories } from './useSortedSearchCategories'

type Props = {
  onCategoryPress: OnCategoryPress
  children?: never
}

export const CategoriesButtons: FunctionComponent<Props> = ({ onCategoryPress }) => {
  const onPressWithAnalytics: OnCategoryPress = useCallback(
    (pressedCategory) => {
      onCategoryPress(pressedCategory)
      analytics.logUseLandingCategory(pressedCategory)
    },
    [onCategoryPress]
  )

  const sortedCategories = useSortedSearchCategories(onPressWithAnalytics)

  return <CategoriesButtonsDisplay sortedCategories={sortedCategories} />
}
