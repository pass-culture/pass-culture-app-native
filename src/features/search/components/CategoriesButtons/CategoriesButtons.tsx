import React, { FunctionComponent } from 'react'

import { CategoriesButtonsDisplay } from './CategoriesButtonsDisplay'
import { OnPressCategory, useSortedSearchCategories } from './useSortedSearchCategories'

type Props = {
  onPressCategory: OnPressCategory
  children?: never
}

export const CategoriesButtons: FunctionComponent<Props> = ({ onPressCategory }) => {
  const sortedCategories = useSortedSearchCategories(onPressCategory)

  return <CategoriesButtonsDisplay sortedCategories={sortedCategories} />
}
