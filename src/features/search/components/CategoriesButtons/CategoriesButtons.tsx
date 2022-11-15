import React, { FunctionComponent, useCallback } from 'react'

import { CategoriesButtonsDisplay } from './CategoriesButtonsDisplay'
import { OnPressCategory, useSortedSearchCategories } from './useSortedSearchCategories'

type Props = {
  onPressCategory: OnPressCategory
  children?: never
}

export const CategoriesButtons: FunctionComponent<Props> = ({ onPressCategory }) => {
  const onPressWithAnalytics: OnPressCategory = useCallback(
    (pressedCategory) => {
      onPressCategory(pressedCategory)
    },
    [onPressCategory]
  )

  const sortedCategories = useSortedSearchCategories(onPressWithAnalytics)

  return <CategoriesButtonsDisplay sortedCategories={sortedCategories} />
}
