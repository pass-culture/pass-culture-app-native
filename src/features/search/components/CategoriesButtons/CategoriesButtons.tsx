import React, { memo } from 'react'

import { useShowResultsForCategory } from 'features/search/helpers/useShowResultsForCategory/useShowResultsForCategory'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'

import { CategoriesButtonsDisplay } from '../CategoriesButtonsDisplay/CategoriesButtonsDisplay'

export const CategoriesButtons = memo(function CategoriesButtons() {
  const showResultsForCategory = useShowResultsForCategory()

  const sortedCategories = useSortedSearchCategories(showResultsForCategory)

  return <CategoriesButtonsDisplay sortedCategories={sortedCategories} />
})
