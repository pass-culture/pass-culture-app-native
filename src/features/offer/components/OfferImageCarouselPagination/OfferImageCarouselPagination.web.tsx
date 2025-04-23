import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { OfferImageCarouselPaginationProps } from 'features/offer/types'
import { CarouselDot } from 'ui/CarouselDot/CarouselDot'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

export const OfferImageCarouselPagination: FunctionComponent<OfferImageCarouselPaginationProps> = ({
  progressValue,
  offerImages,
  handlePressButton,
}) => {
  const carouselDotId = uuidv4()

  const onPressButton = (direction: 1 | -1) => {
    if (handlePressButton) {
      handlePressButton(direction)
    }
  }

  if (!progressValue) return null

  return (
    <Container testID="buttonsAndDotsContainer">
      <RoundedButton
        iconName="previous"
        onPress={() => onPressButton(-1)}
        accessibilityLabel="Image précédente"
      />

      <DotContainer gap={1.3}>
        {offerImages.map((_, index) => (
          <CarouselDot animValue={progressValue} index={index} key={index + carouselDotId} />
        ))}
      </DotContainer>

      <RoundedButton
        iconName="next"
        onPress={() => onPressButton(1)}
        accessibilityLabel="Image suivante"
      />
    </Container>
  )
}

const DotContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
})
const Container = styled.View({
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
})
