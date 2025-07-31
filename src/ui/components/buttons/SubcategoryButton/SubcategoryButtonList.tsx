import React from 'react'
import { FlexStyle } from 'react-native'
import styled from 'styled-components/native'

import {
  SubcategoryButton,
  SUBCATEGORY_BUTTON_HEIGHT,
  SubcategoryButtonItem,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { getSpacing } from 'ui/theme'

type SubcategoryButtonListProps = {
  subcategoryButtonContent: SubcategoryButtonItem[]
}

export const SubcategoryButtonList: React.FC<SubcategoryButtonListProps> = ({
  subcategoryButtonContent,
}) => (
  <StyledScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    itemsNumber={subcategoryButtonContent.length}>
    {subcategoryButtonContent.map((item) => (
      <SubcategoryButton key={item.label} {...item} />
    ))}
  </StyledScrollView>
)

const StyledScrollView = styled.ScrollView.attrs<{ itemsNumber: number }>(
  ({ theme, itemsNumber }) => ({
    contentContainerStyle: theme.isMobileViewport
      ? {
          flexWrap: 'wrap',
          flexDirection: itemsNumber < 3 ? 'row' : 'column',
          padding: getSpacing(6),
          maxHeight: SUBCATEGORY_BUTTON_HEIGHT * 2 + getSpacing(6) * 2 + getSpacing(4),
          gap: getSpacing(4),
        }
      : {
          padding: getSpacing(6),
          gap: getSpacing(4),
          width: '100%',
          display: 'grid' as FlexStyle['display'],
          gridTemplateColumns: `repeat(${theme.isTabletViewport ? 4 : 5}, 1fr)`,
        },
  })
)``
