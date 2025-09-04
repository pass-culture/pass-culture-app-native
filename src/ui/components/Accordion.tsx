import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextProps,
  View,
  ViewStyle,
} from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useFunctionOnce } from 'libs/hooks'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { ArrowNext as DefaultArrowNext } from '../svg/icons/ArrowNext'
import { getSpacing, Typo } from '../theme'

interface AccordionProps {
  title: React.JSX.Element | string
  titleComponent?: React.FC<TextProps>
  titleStyle?: StyleProp<ViewStyle>
  bodyStyle?: StyleProp<ViewStyle>
  labelId?: string
  leftComponent?: React.ReactElement
  children: React.JSX.Element | React.JSX.Element[]
  defaultOpen?: boolean
  onOpenOnce?: () => void
  onOpen?: () => void
  accessibilityLabel?: string
}

const isWeb = Platform.OS === 'web'
export const Accordion = ({
  title,
  titleComponent,
  titleStyle,
  bodyStyle,
  labelId,
  leftComponent,
  children,
  defaultOpen = false,
  onOpenOnce,
  onOpen,
  accessibilityLabel,
}: AccordionProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const [showChildren, setShowChildren] = useState(defaultOpen)
  const [bodySectionHeight, setBodySectionHeight] = useState<number>(0)
  const animatedController = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current
  const openOnce = useFunctionOnce(onOpenOnce)
  const Title = titleComponent || StyledTitle

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
      onOpen?.()
      onOpenOnce && openOnce()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const accordionLabelId = labelId ?? uuidv4()
  const accordionBodyId = uuidv4()

  const accessibilityProps = useMemo(() => {
    return isWeb ? { accessibilityExpanded: open } : { accessibilityState: { expanded: open } }
  }, [open])

  return (
    <React.Fragment>
      <SwitchContainer>
        {leftComponent ? (
          <LeftComponentView style={[styles.titleContainer, titleStyle]}>
            {leftComponent}
          </LeftComponentView>
        ) : null}
        <StyledTouchableOpacity
          accessibilityLabel={accessibilityLabel}
          accessibilityRole={AccessibilityRole.BUTTON}
          onPress={toggleListItem}
          accessibilityControls={accordionBodyId}
          testID="accordionTouchable"
          {...accessibilityProps}>
          <View nativeID={accordionLabelId} style={[styles.titleContainer, titleStyle]}>
            <Title {...getHeadingAttrs(2)}>{title}</Title>
            <StyledArrowAnimatedView
              style={{ transform: [{ rotateZ: arrowAngle }] }}
              testID="accordionArrow">
              <ArrowNext />
            </StyledArrowAnimatedView>
          </View>
        </StyledTouchableOpacity>
      </SwitchContainer>
      <StyledAnimatedView style={{ height: bodyHeight }} testID="accordionBody">
        <StyledView
          nativeID={accordionBodyId}
          style={bodyStyle}
          testID="accordionBodyContainer"
          onLayout={(event: LayoutChangeEvent) =>
            setBodySectionHeight(event.nativeEvent.layout.height)
          }
          hidden={!showChildren}
          accessibilityLabelledBy={accordionLabelId}>
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
    ...(isWeb ? { cursor: 'pointer' } : {}),
  },
})

const StyledView = styled(View)<{ hidden: boolean }>(({ hidden }) => ({
  display: hidden ? 'none' : 'flex',
  position: 'absolute',
  bottom: 0,
  width: '100%',
  paddingBottom: getSpacing(6),
  paddingHorizontal: getSpacing(6),
  paddingTop: 0,
}))

const SwitchContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledTouchableOpacity = styled(TouchableOpacity).attrs({
  activeOpacity: 1,
})<{
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  flex: 1,
  ...touchableFocusOutline({ theme, isFocus }),
}))

const StyledTitle = styled(Typo.Title4)({
  flexShrink: 1,
})

const StyledArrowAnimatedView = styled(Animated.View)({
  marginLeft: getSpacing(2),
})

const StyledAnimatedView = styled(Animated.View)({
  overflow: 'hidden',
})

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
  color: theme.designSystem.color.icon.default,
}))``

const LeftComponentView = styled.View({
  marginRight: getSpacing(2),
})
