import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  TextProps,
  View,
  ViewStyle,
} from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useFunctionOnce } from 'libs/hooks'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { extractTextFromReactNode } from 'shared/extractTextFromReactNode/extractTextFromReactNode'
import { ANIMATION_USE_NATIVE_DRIVER } from 'ui/components/animationUseNativeDriver'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { ArrowNext as DefaultArrowNext } from '../svg/icons/ArrowNext'
import { Typo } from '../theme'

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
  const focusProps = useHandleFocus()
  const [open, setOpen] = useState(defaultOpen)
  const [showChildren, setShowChildren] = useState(defaultOpen)
  const [bodySectionHeight, setBodySectionHeight] = useState<number>(0)

  const layoutAnimController = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current
  const transformAnimController = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current

  const openOnce = useFunctionOnce(onOpenOnce)
  const Title = titleComponent || StyledTitle

  const bodyHeight = layoutAnimController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  })

  const arrowAngle = transformAnimController.interpolate({
    inputRange: [0, 1],
    outputRange: [`${Math.PI / 2}rad`, `${(3 * Math.PI) / 2}rad`],
  })

  const toggleListItem = () => {
    const toValue = open ? 0 : 1
    !open && setShowChildren(true) // Display children before opening animation begins

    Animated.parallel([
      Animated.timing(layoutAnimController, {
        duration: 300,
        toValue,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        // height animation not compatible with native driver use
        useNativeDriver: false,
      }),
      Animated.timing(transformAnimController, {
        duration: 300,
        toValue,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: ANIMATION_USE_NATIVE_DRIVER,
      }),
    ]).start(() => {
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

  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    accessibilityLabel ?? extractTextFromReactNode(title),
    'Accordéon',
    open ? 'Réduire l’accordéon' : 'Développer l’accordéon'
  )

  return (
    <React.Fragment>
      <SwitchContainer>
        {leftComponent ? (
          <LeftComponentView style={titleStyle}>{leftComponent}</LeftComponentView>
        ) : null}
        <StyledTouchableOpacity
          accessibilityLabel={computedAccessibilityLabel}
          accessibilityRole={AccessibilityRole.BUTTON}
          onPress={toggleListItem}
          accessibilityControls={accordionBodyId}
          testID="accordionTouchable"
          onMouseDown={(e) => e.preventDefault()}
          {...focusProps}
          {...accessibilityProps}>
          <StyledTitleContainer nativeID={accordionLabelId} style={titleStyle}>
            <Title {...getHeadingAttrs(2)}>{title}</Title>
            <StyledArrowAnimatedView
              style={{ transform: [{ rotateZ: arrowAngle }] }}
              testID="accordionArrow">
              <ArrowNext />
            </StyledArrowAnimatedView>
          </StyledTitleContainer>
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

const StyledTitleContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.designSystem.size.spacing.xl,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  ...(isWeb ? { cursor: 'pointer' } : {}),
}))

const StyledView = styled(View)<{ hidden: boolean }>(({ hidden, theme }) => ({
  display: hidden ? 'none' : 'flex',
  position: 'absolute',
  bottom: 0,
  width: '100%',
  paddingBottom: theme.designSystem.size.spacing.xl,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  paddingTop: 0,
}))

const SwitchContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledTouchableOpacity = styled(TouchableOpacity)<{
  onMouseDown: (e: Event) => void
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  flex: 1,
  ...customFocusOutline({ theme, isFocus }),
}))

const StyledTitle = styled(Typo.Title4)({
  flexShrink: 1,
})

const StyledArrowAnimatedView = styled(Animated.View)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
}))

const StyledAnimatedView = styled(Animated.View)({
  overflow: 'hidden',
})

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
  color: theme.designSystem.color.icon.default,
}))``

const LeftComponentView = styled(StyledTitleContainer)(({ theme }) => ({
  marginRight: theme.designSystem.size.spacing.s,
}))
