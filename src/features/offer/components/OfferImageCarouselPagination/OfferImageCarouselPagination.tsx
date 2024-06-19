import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { OfferImageCarouselPaginationProps } from 'features/offer/types'
import { CarouselDot } from 'ui/CarouselDot/CarouselDot'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const OfferImageCarouselPagination: FunctionComponent<OfferImageCarouselPaginationProps> = ({
  progressValue,
  offerImages,
}) => {
  const carouselDotId = uuidv4()

  if (!progressValue) return null

  return (
    <Container gap={2} testID="onlyDotsContainer">
      {offerImages.map((_, index) => (
        <CarouselDot animValue={progressValue} index={index} key={index + carouselDotId} />
      ))}
    </Container>
  )
}

const Container = styled(ViewGap)({
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
})
