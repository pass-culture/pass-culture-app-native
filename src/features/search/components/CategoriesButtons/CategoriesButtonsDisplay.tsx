import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { CategoryButton, CategoryButtonProps } from '../CategoryButton'

export type ListCategoryButtonProps = CategoryButtonProps[]

type Props = {
  sortedCategories: ListCategoryButtonProps
  children?: never
}

const CategoyButtonItem: FunctionComponent<{ item: CategoryButtonProps }> = ({ item }) => (
  <CategoryButtonContainer>
    <CategoryButton {...item} />
  </CategoryButtonContainer>
)

export const CategoriesButtonsDisplay: FunctionComponent<Props> = ({ sortedCategories }) => (
  <FlatList
    data={sortedCategories}
    renderItem={CategoyButtonItem}
    keyExtractor={(item) => item.label}
    numColumns={2}
    testID="categoriesButtons"
  />
)

const CategoryButtonContainer = styled.View({
  flexBasis: '50%',
  padding: getSpacing(1),
})
