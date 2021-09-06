import { t } from '@lingui/macro'
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
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  description?: string | undefined
}

const NUMBER_OF_LINES = 5
const ANIMATION_DURATION = 500 //ms
const PARTIAL_DESCRIPTION_HEIGHT = getSpacing(NUMBER_OF_LINES * 5)

export const PartialAccordionDescription: React.FC<Props> = ({ description = '' }) => {
  const [open, setOpen] = useState(false)
  const [totalDescriptionHeight, setTotalDescriptionHeight] = useState<number>(0)
  const [maxLines, setMaxLines] = useState<number | undefined>(NUMBER_OF_LINES)
  const animatedController = useRef(new Animated.Value(0)).current
  const isLongDescription = PARTIAL_DESCRIPTION_HEIGHT <= totalDescriptionHeight
  const buttonLabel = open ? t`voir moins` : t`voir plus`

  const toggleDescription = () => {
    Animated.timing(animatedController, {
      duration: ANIMATION_DURATION,
      toValue: open ? 0 : 1,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start(() => setOpen((prevOpen) => !prevOpen))
    switchMaxLines()
  }

  const switchMaxLines = () => {
    if (!open) {
      setMaxLines(undefined)
    } else {
      setTimeout(() => {
        setMaxLines(NUMBER_OF_LINES)
      }, ANIMATION_DURATION)
    }
  }

  const onLayout = (event: LayoutChangeEvent) =>
    setTotalDescriptionHeight(event.nativeEvent.layout.height)

  const bodyDescriptionHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isLongDescription ? PARTIAL_DESCRIPTION_HEIGHT : totalDescriptionHeight,
      totalDescriptionHeight,
    ],
  })

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [`${2 * Math.PI}rad`, `${(2 * Math.PI) / 2}rad`],
  })

  if (!description) return null
  return (
    <Container>
      <StyledAnimatedView style={{ height: bodyDescriptionHeight }} testID="accordionBody">
        <DescriptionContainer onLayout={onLayout} testID="descriptionContainer">
          <Description numberOfLines={maxLines}>{highlightLinks(description)}</Description>
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
  paddingVertical: getSpacing(6),
})

const StyledAnimatedView = styled(Animated.View)({
  overflow: 'hidden',
})

const DescriptionContainer = styled.View({
  position: 'absolute',
  top: 0,
  width: '100%',
})

const Description = styled(Typo.Body)({
  width: '100%',
})

const SeeMoreButton = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  alignSelf: 'flex-end',
  paddingTop: getSpacing(4),
  ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
})
