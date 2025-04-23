import React, { FunctionComponent } from 'react'
import { SharedValue } from 'react-native-reanimated'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CarouselDot } from 'ui/CarouselDot/CarouselDot'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  progressValue: SharedValue<number>
  offerImages: string[]
  gap: number
}

export const OfferImageCarouselDots: FunctionComponent<Props> = ({
  progressValue,
  offerImages,
  gap,
}) => {
  const carouselDotId = uuidv4()

  if (!progressValue) return null

  return (
    <Container gap={gap}>
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
