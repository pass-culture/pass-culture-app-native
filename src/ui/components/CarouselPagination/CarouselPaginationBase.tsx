import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CarouselDot } from 'ui/components/CarouselDot/CarouselDot'
import { CarouselPaginationProps } from 'ui/components/CarouselPagination/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const CarouselPaginationBase: FunctionComponent<CarouselPaginationProps> = ({
  progressValue,
  elementsCount,
  gap,
  style,
}) => {
  const carouselDotId = uuidv4()

  if (!progressValue) return null

  return (
    <Container gap={gap} style={style}>
      {Array.from({ length: elementsCount }).map((_, index) => (
        <CarouselDot animValue={progressValue} index={index} key={index + carouselDotId} />
      ))}
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
  backgroundColor: theme.designSystem.color.background.locked,
  paddingVertical: theme.designSystem.size.spacing.xs,
  paddingHorizontal: theme.designSystem.size.spacing.s,
  borderRadius: theme.designSystem.size.borderRadius.xxl,
}))
