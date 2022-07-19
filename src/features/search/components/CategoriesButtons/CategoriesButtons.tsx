import React, { FunctionComponent } from 'react'

import { CategoriesButtonsDisplay } from './CategoriesButtonsDisplay'
import { OnCategoryPress, useSortedSearchCategories } from './useSortedSearchCategories'

type Props = {
  onCategoryPress: OnCategoryPress
  children?: never
}

export const CategoriesButtons: FunctionComponent<Props> = ({ onCategoryPress }) => {
  const sortedCategories = useSortedSearchCategories(onCategoryPress)

  return <CategoriesButtonsDisplay sortedCategories={sortedCategories} />
}
