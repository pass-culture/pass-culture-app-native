import React, { FunctionComponent } from 'react'

import { CategoriesButtonsDisplay } from './CategoriesButtonsDisplay'
import { useSortedSearchCategories } from './useSortedSearchCategories'

type Props = {
  children?: never
}

export const CategoriesButtons: FunctionComponent<Props> = () => {
  const sortedCategories = useSortedSearchCategories()

  return <CategoriesButtonsDisplay sortedCategories={sortedCategories} />
}
