import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import {
  CATEGORY_HEADER_HEIGHT,
  CategoryThematicHomeHeaderContent,
} from 'features/home/components/headers/CategoryThematicHomeHeaderContent'
import { CategoryThematicHeader } from 'features/home/types'
import { getSpacing } from 'ui/theme'

export const MOBILE_HEADER_HEIGHT = CATEGORY_HEADER_HEIGHT

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'> & {
  homeId: string
}

export const AnimatedCategoryThematicHomeHeader: FunctionComponent<CategoryThematicHeaderProps> = (
  props
) => (
  <Container>
    <CategoryThematicHomeHeaderContent {...props} />
  </Container>
)

const Container = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: getSpacing(MOBILE_HEADER_HEIGHT),
})
