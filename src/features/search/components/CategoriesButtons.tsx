import React, { FunctionComponent, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { CategoryButton, CategoryButtonProps } from 'features/search/components/CategoryButton'

type Props = {
  categories: CategoryButtonProps[]
  children?: never
}

export const CategoriesButtons: FunctionComponent<Props> = ({ categories }) => {
  const [sortedCategories, setSortedCategories] = useState<CategoryButtonProps[]>()
  useEffect(() => {
    setSortedCategories([...categories].sort((a, b) => a.label.localeCompare(b.label)))
  }, [categories])

  return (
    <FlatList
      data={sortedCategories}
      renderItem={({ item }) => <StyledCategoryButton {...item} />}
      keyExtractor={(item) => item.label}
      numColumns={2}
    />
  )
}

const StyledCategoryButton = styled(CategoryButton)({
  flex: 1,
  margin: 4,
})
