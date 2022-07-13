import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

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

export const CategoriesButtonsDisplay: FunctionComponent<Props> = ({ sortedCategories }) => {
  const theme = useTheme()
  const numColumns = theme.isDesktopViewport ? 4 : 2
  const key = numColumns // update key to avoid the following error: Changing numColumns on the fly is not supported. Change the key prop on FlatList when changing the number of columns to force a fresh render of the component.
  return (
    <FlatList
      data={sortedCategories}
      renderItem={CategoyButtonItem}
      keyExtractor={(item) => item.label}
      numColumns={numColumns}
      key={key}
      ListHeaderComponent={CategoriesTitle}
      contentContainerStyle={contentContainerStyle}
      testID="categoriesButtons"
    />
  )
}

const CategoriesTitle = styled(Typo.Title4).attrs({
  children: 'Explore les catégories',
})({
  marginTop: getSpacing(5),
  paddingHorizontal: getSpacing(1),
  paddingBottom: getSpacing(4),
})

const contentContainerStyle = {
  paddingVertical: getSpacing(6),
  paddingHorizontal: getSpacing(5),
}

const CategoryButtonContainer = styled.View(({ theme }) => ({
  flexBasis: theme.isDesktopViewport ? '25%' : '50%',
  padding: getSpacing(theme.isDesktopViewport ? 2 : 1),
}))
