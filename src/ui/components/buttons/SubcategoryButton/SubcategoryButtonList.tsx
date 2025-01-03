import { CategoryKey } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import React from 'react'
import styled from 'styled-components/native'

import {
  SUBCATEGORY_BUTTON_HEIGHT,
  SubcategoryButton,
  SubcategoryButtonProps,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { getSpacing } from 'ui/theme'

export type SubcategoryButtonItem = Omit<SubcategoryButtonProps, 'onPress'> & {
  categoryKey: CategoryKey
}

type SubcategoryButtonListProps = {
  subcategoryButtonContent: SubcategoryButtonItem[]
  onPress: (nativeCategory: CategoryKey) => void
}

export const SubcategoryButtonList: React.FC<SubcategoryButtonListProps> = ({
  subcategoryButtonContent,
  onPress,
}) => (
  <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
    {subcategoryButtonContent.map((item) => (
      <SubcategoryButton key={item.label} {...item} onPress={() => onPress(item.categoryKey)} />
    ))}
  </StyledScrollView>
)

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: theme.isMobileViewport
    ? {
        flexWrap: 'wrap',
        flexDirection: 'column',
        padding: getSpacing(6),
        maxHeight: SUBCATEGORY_BUTTON_HEIGHT * 2 + getSpacing(6) * 2 + getSpacing(4),
        gap: getSpacing(4),
      }
    : {
        padding: getSpacing(6),
        gap: getSpacing(4),
        width: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${theme.isTabletViewport ? 4 : 5}, 1fr)`,
      },
}))``
