import React, { FunctionComponent, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { CategoryButton, CategoryButtonProps } from 'features/search/components/CategoryButton'
import { getSpacing } from 'ui/theme'

type Props = {
  categories: CategoryButtonProps[]
  children?: never
}

const CategoyButtonItem: FunctionComponent<{ item: CategoryButtonProps }> = ({ item }) => (
  <CategoryButtonContainer>
    <CategoryButton {...item} />
  </CategoryButtonContainer>
)

export const CategoriesButtons: FunctionComponent<Props> = ({ categories }) => {
  const [sortedCategories, setSortedCategories] = useState<CategoryButtonProps[]>()
  useEffect(() => {
    setSortedCategories([...categories].sort((a, b) => a.label.localeCompare(b.label)))
  }, [categories])

  return (
    <FlatList
      data={sortedCategories}
      renderItem={CategoyButtonItem}
      keyExtractor={(item) => item.label}
      numColumns={2}
    />
  )
}

const CategoryButtonContainer = styled.View({
  flexBasis: '50%',
  padding: getSpacing(1),
})
