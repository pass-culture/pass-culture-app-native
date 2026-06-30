import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import {
  CATEGORY_HEADER_HEIGHT,
  CategoryThematicHomeHeaderContent,
} from 'features/home/components/headers/CategoryThematicHomeHeaderContent'
import { CategoryThematicHeader } from 'features/home/types'
import { getSpacing } from 'ui/theme'

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'> & {
  homeId: string
}

export const CategoryThematicHomeHeader: FunctionComponent<CategoryThematicHeaderProps> = (
  props
) => (
  <Container>
    <CategoryThematicHomeHeaderContent {...props} />
  </Container>
)

const Container = styled.View(({ theme }) => ({
  height: getSpacing(CATEGORY_HEADER_HEIGHT),
  marginBottom: theme.designSystem.size.spacing.xl,
}))
