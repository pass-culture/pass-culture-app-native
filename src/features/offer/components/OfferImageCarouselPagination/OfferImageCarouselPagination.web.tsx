import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { OfferImageCarouselPaginationProps } from 'features/offer/types'
import { CarouselDot } from 'ui/CarouselDot/CarouselDot'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const OfferImageCarouselPagination: FunctionComponent<OfferImageCarouselPaginationProps> = ({
  progressValue,
  offerImages,
  handlePressButton,
}) => {
  const carouselDotId = uuidv4()

  if (!progressValue) return null

  return (
    <Container gap={4} testID="buttonsAndDotsContainer">
      <RoundedButton
        iconName="previous"
        onPress={() => handlePressButton(-1)}
        accessibilityLabel="Image précédente"
      />

      {offerImages.map((_, index) => (
        <CarouselDot animValue={progressValue} index={index} key={index + carouselDotId} />
      ))}

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
