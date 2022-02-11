import { t } from '@lingui/macro'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import {
  Platform,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  View,
  StyleSheet,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native'
import styled from 'styled-components/native'

import { useFunctionOnce } from 'libs/hooks'
import { getHeadingAttrs } from 'ui/theme/typography'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ArrowNext as DefaultArrowNext } from '../svg/icons/ArrowNext'
import { getSpacing, Typo } from '../theme'

interface IAccordionItemProps {
  scrollViewRef?: MutableRefObject<ScrollView | null>
  title: JSX.Element | string
  children: JSX.Element | JSX.Element[]
  defaultOpen?: boolean
  onOpenOnce?: () => void
  titleStyle?: StyleProp<ViewStyle>
  bodyStyle?: StyleProp<ViewStyle>
}

export const AccordionItem = ({
  scrollViewRef,
  title,
  children,
  defaultOpen = false,
  onOpenOnce,
  titleStyle,
  bodyStyle,
}: IAccordionItemProps) => {
  const { tabBarHeight, top } = useCustomSafeInsets()
  const [open, setOpen] = useState(defaultOpen)
  const [showChildren, setShowChildren] = useState(defaultOpen)
  const [bodyPositionY, setBodyPositionY] = useState<number>(0)
  const [bodySectionHeight, setBodySectionHeight] = useState<number>(0)
  const animatedController = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current
  const openOnce = useFunctionOnce(onOpenOnce)
  const onOpen = () => {
    if (!!scrollViewRef && scrollViewRef !== null && scrollViewRef.current !== null) {
      scrollViewRef.current.scrollTo({
        x: 0,
        y: bodyPositionY - (tabBarHeight + top),
        animated: true,
      })
    }
  }

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  })

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [`${Math.PI / 2}rad`, `${(3 * Math.PI) / 2}rad`],
  })

  const toggleListItem = () => {
    !open && setShowChildren(true) // Display children before opening animation begins
    Animated.timing(animatedController, {
      duration: 300,
      toValue: open ? 0 : 1,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start(() => {
      setOpen((prevOpen) => {
        prevOpen && setShowChildren(false) // Hide children after closing animation ends
        return !prevOpen
      })
    })
  }

  useEffect(() => {
    if (open) {
      onOpen()
      onOpenOnce && openOnce()
    }
  }, [open])

  const getPositionOfAccordionItem = (event: LayoutChangeEvent) => {
    setBodyPositionY(event.nativeEvent.layout.y)
  }

  return (
    <React.Fragment>
      <TouchableWithoutFeedback
        onPress={toggleListItem}
        onLayout={getPositionOfAccordionItem}
        accessibilityLabel={open ? t`Fermer la section` : t`Ouvrir la section`}>
        <View style={[styles.titleContainer, titleStyle]}>
          <Title>{title}</Title>
          <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }} testID="accordionArrow">
            <ArrowNext />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <StyledAnimatedView style={{ height: bodyHeight }} testID="accordionBody">
        <StyledView
          style={bodyStyle}
          testID="accordionBodyContainer"
          onLayout={(event) => setBodySectionHeight(event.nativeEvent.layout.height)}
          hidden={!showChildren}>
          {children}
        </StyledView>
      </StyledAnimatedView>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getSpacing(5),
    paddingHorizontal: getSpacing(6),
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
})

const StyledView = styled.View<{ hidden: boolean }>(({ hidden }) => ({
  display: hidden ? 'none' : 'flex',
  position: 'absolute',
  bottom: 0,
  width: '100%',
  paddingBottom: getSpacing(6),
  paddingHorizontal: getSpacing(6),
  paddingTop: 0,
}))

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(2))({
  flex: '0.9',
})

const StyledAnimatedView = styled(Animated.View)({ overflow: 'hidden' })

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
