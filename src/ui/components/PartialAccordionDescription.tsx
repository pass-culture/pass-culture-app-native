import { t } from '@lingui/macro'
import { Spacer } from '@pass-culture/id-check'
import React, { useRef, useState } from 'react'
import {
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Platform,
  LayoutChangeEvent,
} from 'react-native'
import styled from 'styled-components/native'

import { highlightLinks } from 'libs/parsers/highlightLinks'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  description?: string | undefined
}

export const PartialAccordionDescription: React.FC<Props> = ({ description = '' }) => {
  const animatedController = useRef(new Animated.Value(0)).current
  const [open, setOpen] = useState(false)
  const [totalDescriptionHeight, setTotalDescriptionHeight] = useState<number>(0)

  const toggleDescription = () => {
    Animated.timing(animatedController, {
      duration: 500,
      toValue: open ? 0 : 1,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start(() => setOpen((prevOpen) => !prevOpen))
  }

  const onLayout = (event: LayoutChangeEvent) =>
    setTotalDescriptionHeight(event.nativeEvent.layout.height)

  const partialDescriptionHeight = getSpacing(15)
  const isLongDescription = partialDescriptionHeight < totalDescriptionHeight

  const bodyDescriptionHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [partialDescriptionHeight, totalDescriptionHeight],
  })

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [`${2 * Math.PI}rad`, `${(2 * Math.PI) / 2}rad`],
  })

  const buttonLabel = open ? t`voir moins` : t`voir plus`

  // TODO (Lucasbeneston) : Remove before merge
  const fakeLongDescription =
    description +
    ' https://pass.culture.fr/ lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, labore nesciunt numquam. Id itaque in sed sapiente blanditiis necessitatibus.'

  if (!description) return null
  return (
    <Container>
      <StyledAnimatedView style={{ height: bodyDescriptionHeight }} testID="accordionBody">
        <DescriptionContainer onLayout={onLayout}>
          <Description>{highlightLinks(fakeLongDescription)}</Description>
        </DescriptionContainer>
      </StyledAnimatedView>
      {!!isLongDescription && (
        <TouchableWithoutFeedback onPress={toggleDescription}>
          <SeeMoreButton>
            <Typo.ButtonText>{buttonLabel}</Typo.ButtonText>
            <Spacer.Row numberOfSpaces={2} />
            <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }} testID="accordionArrow">
              <ArrowDown size={getSpacing(5)} />
            </Animated.View>
          </SeeMoreButton>
        </TouchableWithoutFeedback>
      )}
    </Container>
  )
}

const Container = styled.View({
  paddingHorizontal: getSpacing(6),
  paddingVertical: getSpacing(2),
})

const DescriptionContainer = styled.View({
  position: 'absolute',
  top: 0,
  width: '100%',
})

const StyledAnimatedView = styled(Animated.View)({
  overflow: 'hidden',
})

const Description = styled(Typo.Body)({
  width: '100%',
})

const SeeMoreButton = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  alignSelf: 'flex-end',
  paddingVertical: getSpacing(4),
  ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
})
