import React from 'react'
import { FlexStyle } from 'react-native'
import styled from 'styled-components/native'

import {
  SubcategoryButton,
  SubcategoryButtonItem,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'

type SubcategoryButtonListProps = {
  subcategoryButtonContent: SubcategoryButtonItem[]
}

export const SubcategoryButtonList: React.FC<SubcategoryButtonListProps> = ({
  subcategoryButtonContent,
}) => (
  <StyledScrollView
    horizontal={subcategoryButtonContent.length > 2}
    showsHorizontalScrollIndicator={false}>
    {subcategoryButtonContent.map((item) => (
      <SubcategoryButton key={item.label} {...item} />
    ))}
  </StyledScrollView>
)

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: theme.isMobileViewport
    ? {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        padding: theme.designSystem.size.spacing.xl,
        gap: theme.designSystem.size.spacing.l,
      }
    : {
        width: '100%',
        display: 'grid' as FlexStyle['display'],
        gridTemplateColumns: `repeat(${theme.isTabletViewport ? 4 : 5}, 1fr)`,
        padding: theme.designSystem.size.spacing.xl,
        gap: theme.designSystem.size.spacing.l,
      },
}))``
