import React, { useEffect, useRef, useState } from 'react'
import { TouchableWithoutFeedback, Animated, Easing } from 'react-native'
import styled from 'styled-components/native'

import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { getSpacing, Typo } from 'ui/theme'

import { useFunctionOnce } from '../services/useFunctionOnce'

interface IAccordionItemProps {
  title: Element | string
  children: Element
  defaultOpen?: boolean
  onOpen?: () => void
  onOpenOnce?: () => void
}

export const AccordionItem = ({
  title,
  children,
  defaultOpen = false,
  onOpen,
  onOpenOnce,
}: IAccordionItemProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const animatedController = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current
  const [bodySectionHeight, setBodySectionHeight] = useState<number>(0)
  const openOnce = useFunctionOnce(onOpenOnce)

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  })

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [`${Math.PI / 2}rad`, `${(3 * Math.PI) / 2}rad`],
  })

  const toggleListItem = () => {
    Animated.timing(animatedController, {
      duration: 300,
      toValue: open ? 0 : 1,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start(() => setOpen((prevOpen) => !prevOpen))
  }

  useEffect(() => {
    if (open) {
      onOpen?.()
      onOpenOnce && openOnce()
    }
  }, [open])

  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={toggleListItem}>
        <TitleContainer>
          <Typo.Title4>{title}</Typo.Title4>
          <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }} testID="accordionArrow">
            <ArrowNext size={getSpacing(6)} />
          </Animated.View>
        </TitleContainer>
      </TouchableWithoutFeedback>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <Animated.View style={{ overflow: 'hidden', height: bodyHeight }} testID="accordionBody">
        <BodyContainer
          testID="accordionBodyContainer"
          onLayout={(event) => setBodySectionHeight(event.nativeEvent.layout.height)}>
          {children}
        </BodyContainer>
      </Animated.View>
    </React.Fragment>
  )
}

const TitleContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: getSpacing(4),
  paddingHorizontal: getSpacing(6),
  paddingTop: getSpacing(6),
})

const BodyContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  paddingBottom: getSpacing(6),
  paddingHorizontal: getSpacing(6),
  paddingTop: 0,
})
