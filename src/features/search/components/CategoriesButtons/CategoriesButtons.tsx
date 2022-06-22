import React, { FunctionComponent, useEffect, useState } from 'react'

import { CategoriesButtonsDisplay, ListCategoryButtonProps } from './CategoriesButtonsDisplay'

type Props = {
  categories: ListCategoryButtonProps
  children?: never
}

export const CategoriesButtons: FunctionComponent<Props> = ({ categories }) => {
  const [sortedCategories, setSortedCategories] = useState<ListCategoryButtonProps>()

  useEffect(() => {
    setSortedCategories([...categories].sort((a, b) => a.label.localeCompare(b.label)))
  }, [categories])

  if (sortedCategories === undefined) return null

  return <CategoriesButtonsDisplay sortedCategories={sortedCategories} />
}
