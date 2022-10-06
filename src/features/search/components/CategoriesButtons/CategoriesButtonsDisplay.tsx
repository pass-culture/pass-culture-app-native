import React, { FunctionComponent } from 'react'
import { FlatList, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { theme } from 'theme'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { CategoryButton, CategoryButtonProps } from '../CategoryButton'

export type ListCategoryButtonProps = CategoryButtonProps[]

type Props = {
  sortedCategories: ListCategoryButtonProps
  children?: never
}

const CategoyButtonItem: FunctionComponent<{ item: CategoryButtonProps }> = ({ item }) => (
  <StyledLi>
    <CategoryButtonContainer>
      <CategoryButton {...item} />
    </CategoryButtonContainer>
  </StyledLi>
)

export const CategoriesButtonsDisplay: FunctionComponent<Props> = ({ sortedCategories }) => {
  const theme = useTheme()
  const numColumns = theme.isDesktopViewport ? 4 : 2
  const key = numColumns // update key to avoid the following error: Changing numColumns on the fly is not supported. Change the key prop on FlatList when changing the number of columns to force a fresh render of the component.
  return (
    <Ul>
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
    </Ul>
  )
}

const CategoriesTitle = styled(Typo.Title4).attrs({
  children: 'Explore les catégories',
  ...getHeadingAttrs(2),
})({
  marginTop: getSpacing(5),
  paddingHorizontal: getSpacing(1),
  paddingBottom: getSpacing(4),
})

const contentContainerStyle = {
  paddingHorizontal: getSpacing(5),
  ...(Platform.OS === 'web'
    ? { paddingBottom: getSpacing(6) }
    : { paddingBottom: getSpacing(6) + theme.tabBar.height }),
}

const CategoryButtonContainer = styled.View(({ theme }) => ({
  padding: getSpacing(theme.isDesktopViewport ? 2 : 1),
}))

const StyledLi = styled(Li)(({ theme }) => ({
  flexBasis: theme.isDesktopViewport ? '25%' : '50%',
}))
