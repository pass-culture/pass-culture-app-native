import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import {
  Platform,
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
import { v4 as uuidv4 } from 'uuid'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useFunctionOnce } from 'libs/hooks'
import FilterSwitch, { FilterSwitchProps } from 'ui/components/FilterSwitch'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ArrowNext as DefaultArrowNext } from '../svg/icons/ArrowNext'
import { getSpacing, Spacer, Typo } from '../theme'

interface AccordionItemProps {
  scrollViewRef?: MutableRefObject<ScrollView | null>
  title: JSX.Element | string
  accessibilityTitle?: string
  children: JSX.Element | JSX.Element[]
  defaultOpen?: boolean
  onOpenOnce?: () => void
  titleStyle?: StyleProp<ViewStyle>
  bodyStyle?: StyleProp<ViewStyle>
  switchProps?: FilterSwitchProps
}

export const AccordionItem = ({
  scrollViewRef,
  title,
  children,
  defaultOpen = false,
  onOpenOnce,
  titleStyle,
  bodyStyle,
  switchProps,
}: AccordionItemProps) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const getPositionOfAccordionItem = (event: LayoutChangeEvent) => {
    setBodyPositionY(event.nativeEvent.layout.y)
  }

  const accordionLabelId = uuidv4()
  const accordionBodyId = uuidv4()

  return (
    <React.Fragment>
      <StyledTouchableOpacity
        accessibilityRole={AccessibilityRole.BUTTON}
        onPress={toggleListItem}
        onLayout={getPositionOfAccordionItem}
        accessibilityState={{ expanded: open }}
        aria-controls={accordionBodyId}>
        <View nativeID={accordionLabelId} style={[styles.titleContainer, titleStyle]}>
          <SwitchContainer>
            {!!switchProps && (
              <React.Fragment>
                <FilterSwitch {...switchProps} />
                <Spacer.Row numberOfSpaces={2} />
              </React.Fragment>
            )}
            <Title>{title}</Title>
          </SwitchContainer>
          <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }} testID="accordionArrow">
            <ArrowNext />
          </Animated.View>
        </View>
      </StyledTouchableOpacity>
      <StyledAnimatedView style={{ height: bodyHeight }} testID="accordionBody">
        <StyledView
          nativeID={accordionBodyId}
          style={bodyStyle}
          testID="accordionBodyContainer"
          onLayout={(event) => setBodySectionHeight(event.nativeEvent.layout.height)}
          hidden={!showChildren}
          aria-labelledby={accordionLabelId}>
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

const SwitchContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledTouchableOpacity = styled(TouchableOpacity).attrs({ activeOpacity: 1 })<{
  isFocus?: boolean
}>(({ theme, isFocus }) => touchableFocusOutline(theme, isFocus))

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(2))({
  flex: '0.9',
})

const StyledAnimatedView = styled(Animated.View)({ overflow: 'hidden' })

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
