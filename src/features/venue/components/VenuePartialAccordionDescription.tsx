import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, TouchableWithoutFeedback, Platform } from 'react-native'
import styled from 'styled-components/native'

import { highlightLinks } from 'libs/parsers/highlightLinks'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { useElementHeight } from 'ui/hooks/useElementHeight'
import { ArrowDown as DefaultArrowDown } from 'ui/svg/icons/ArrowDown'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  description?: string
  credit?: string | null
}

const NUMBER_OF_LINES = 3
export const PARTIAL_DESCRIPTION_HEIGHT = getSpacing(NUMBER_OF_LINES * 5) // Ratio : height for one line = getSpacing(5)
export const ANIMATION_DURATION = 500 //ms

export const VenuePartialAccordionDescription: React.FC<Props> = ({ description, credit }) => {
  const { onLayout, height: totalDescriptionHeight } = useElementHeight()
  const [open, setOpen] = useState(false)
  const [maxLines, setMaxLines] = useState<number | undefined>(undefined)
  const [isLongDescription, setIsLongDescription] = useState(false)
  const animatedController = useRef(new Animated.Value(0)).current
  const buttonLabel = open ? 'voir moins' : 'voir plus'

  useEffect(() => {
    if (PARTIAL_DESCRIPTION_HEIGHT <= totalDescriptionHeight && !open) {
      setIsLongDescription(true)
      setMaxLines(NUMBER_OF_LINES)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalDescriptionHeight])

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

  if (!description && !credit) return <Spacer.Column numberOfSpaces={6} />

  const creditText = `Crédit photo\u00a0: ${credit}`

  return (
    <Container>
      <StyledAnimatedView style={{ height: bodyDescriptionHeight }} testID="accordionBody">
        <DescriptionContainer onLayout={onLayout} testID="descriptionContainer">
          {!!description && (
            <Description numberOfLines={maxLines}>{highlightLinks(description)}</Description>
          )}
          {!!credit && <Credit testID="credit">{creditText}</Credit>}
        </DescriptionContainer>
      </StyledAnimatedView>
      {!!isLongDescription && (
        <TouchableWithoutFeedback onPress={toggleDescription}>
          <SeeMoreButton>
            <Typo.ButtonText>{buttonLabel}</Typo.ButtonText>
            <Spacer.Row numberOfSpaces={2} />
            <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }} testID="accordionArrow">
              <ArrowDown />
            </Animated.View>
          </SeeMoreButton>
        </TouchableWithoutFeedback>
      )}
    </Container>
  )
}

const Container = styled.View({
  padding: getSpacing(6),
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

const ArrowDown = styled(DefaultArrowDown).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const Credit = styled(GreyDarkCaption)({
  marginTop: getSpacing(6),
})
