import React, { FunctionComponent, useCallback } from 'react'

import {
  OnPressCategory,
  useSortedSearchCategories,
} from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'

import { CategoriesButtonsDisplay } from '../CategoriesButtonsDisplay/CategoriesButtonsDisplay'

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
