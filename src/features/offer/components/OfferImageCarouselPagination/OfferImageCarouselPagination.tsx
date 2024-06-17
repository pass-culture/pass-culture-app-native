import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CarouselDot } from 'ui/CarouselDot/CarouselDot'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  progressValue: SharedValue<number>
  offerImages: string[]
  onPressPreviousButton: VoidFunction
  onPressNextButton: VoidFunction
}

const isWeb = Platform.OS === 'web'

export const OfferImageCarouselPagination: FunctionComponent<Props> = ({
  progressValue,
  offerImages,
  onPressPreviousButton,
  onPressNextButton,
}) => {
  const carouselDotId = uuidv4()

  if (!progressValue) return null

  return (
    <Container gap={isWeb ? 4 : 2} testID={isWeb ? 'buttonsAndDotsContainer' : 'onlyDotsContainer'}>
      {isWeb ? (
        <RoundedButton
          iconName="previous"
          onPress={onPressPreviousButton}
          accessibilityLabel="Image précédente"
        />
      ) : null}
      {offerImages.map((_, index) => (
        <CarouselDot animValue={progressValue} index={index} key={index + carouselDotId} />
      ))}
      {isWeb ? (
        <RoundedButton
          iconName="next"
          onPress={onPressNextButton}
          accessibilityLabel="Image suivante"
        />
      ) : null}
    </Container>
  )
}

const Container = styled(ViewGap)({
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
})
