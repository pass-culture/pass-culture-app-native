import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { CarouselPaginationBase } from 'ui/components/CarouselPagination/CarouselPaginationBase'
import { CarouselPaginationProps } from 'ui/components/CarouselPagination/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const CarouselPagination: FunctionComponent<CarouselPaginationProps> = ({
  progressValue,
  elementsCount,
  gap,
  carouselRef,
  style,
}) => {
  const handlePressButton = (direction: 1 | -1) => {
    const newIndex = calculateCarouselIndex({
      currentIndex: progressValue.value,
      direction,
      maxIndex: elementsCount - 1,
    })
    progressValue.value = newIndex
    carouselRef.current?.scrollTo({ index: newIndex, animated: true })
  }

  return (
    <Container gap={6} style={style}>
      <RoundedButton
        iconName="previous"
        onPress={() => handlePressButton(-1)}
        accessibilityLabel="Image précédente"
      />
      <CarouselPaginationBase
        progressValue={progressValue}
        elementsCount={elementsCount}
        gap={gap}
        carouselRef={carouselRef}
      />
      <RoundedButton
        iconName="next"
        onPress={() => handlePressButton(1)}
        accessibilityLabel="Image suivante"
      />
    </Container>
  )
}

const Container = styled(ViewGap)({
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
})
