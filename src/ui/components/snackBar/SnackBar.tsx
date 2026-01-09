import React, {
  FunctionComponent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Platform, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { scheduleOnRN } from 'react-native-worklets'
import styled, { useTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ColorsType, TextColorKey } from 'theme/types'
import { SnackBarProgressBar } from 'ui/components/snackBar/SnackBarProgressBar'
import { Touchable } from 'ui/components/touchable/Touchable'
import { CloseFilled } from 'ui/svg/icons/CloseFilled'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, Typo, getSpacing } from 'ui/theme'

export type SnackBarProps = {
  visible: boolean
  message: string
  icon: FunctionComponent<AccessibleIcon> | undefined
  onClose?: () => void
  timeout?: number
  backgroundColor: ColorsType
  progressBarColor: ColorsType
  color: TextColorKey
  animationDuration?: number
  refresher: number
}

const SnackBarBase = (props: SnackBarProps) => {
  const { designSystem } = useTheme()
  const firstRender = useRef(true)
  const animationDuration = props.animationDuration || 500

  const opacity = useSharedValue(0) // transparent
  const translateY = useSharedValue(-20) // slightly above

  const [isVisible, setIsVisible] = useState(props.visible)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }
  }, [opacity, translateY])

  const triggerApparitionAnimation = useCallback(() => {
    setIsVisible(true)
    opacity.value = withTiming(1, { duration: animationDuration, easing: Easing.out(Easing.ease) })
    translateY.value = withTiming(0, {
      duration: animationDuration,
      easing: Easing.out(Easing.ease),
    })
  }, [animationDuration, opacity, translateY])

  const triggerVanishAnimation = useCallback(() => {
    opacity.value = withTiming(0, { duration: animationDuration, easing: Easing.out(Easing.ease) })
    translateY.value = withTiming(
      -20,
      { duration: animationDuration, easing: Easing.out(Easing.ease) },
      (finished) => {
        if (finished) {
          // Update state on JS thread
          scheduleOnRN(setIsVisible, false)
        }
      }
    )
  }, [animationDuration, opacity, translateY])

  const onClose = useCallback(() => props.onClose?.(), [props])

  const Icon = useMemo(() => {
    const iconAccessibilityLabelProps = props.visible ? {} : { accessibilityLabel: undefined }
    if (!props.icon) return null
    return styled(props.icon).attrs(({ theme }) => ({
      size: theme.icons.sizes.small,
      ...iconAccessibilityLabelProps,
    }))``
  }, [props.icon, props.visible])

  // Visibility effect
  useEffect(() => {
    // Handle initial load if visible is true
    if (firstRender.current && props.visible) {
      triggerApparitionAnimation()
    }

    if (props.visible || isVisible) {
      firstRender.current = false
    }

    if (props.refresher <= 0) {
      return
    }
    const shouldDisplay = props.visible && !isVisible
    const shouldHide = !props.visible && isVisible
    if (shouldDisplay) {
      triggerApparitionAnimation()
    }
    if (shouldHide) {
      triggerVanishAnimation()
    }
    // Timeout section: We want to reset the timer when props are changed
    if (!props.timeout || !props.onClose || shouldHide) {
      return
    }
    const timeout = setTimeout(props.onClose, props.timeout)
    return () => clearTimeout(timeout)
  }, [
    props.refresher,
    props.visible,
    isVisible,
    props.timeout,
    props.onClose,
    triggerApparitionAnimation,
    triggerVanishAnimation,
  ])

  const { top } = useSafeAreaInsets()

  function renderProgressBar() {
    return (
      <View>
        {isVisible && props.timeout ? (
          <SnackBarProgressBar
            color={props.progressBarColor}
            timeout={props.timeout}
            refresher={props.refresher}
            visible={props.visible}
          />
        ) : null}
      </View>
    )
  }

  // If in web, always display snackbar content. Else, don't display until needed, then keep mounted (using firstRender)
  const renderContent = Platform.OS === 'web' || !firstRender.current || isVisible
  return (
    <RootContainer>
      <ColoredAnimatedView
        testID="snackbar-view"
        style={animatedStyle}
        backgroundColor={props.backgroundColor}>
        {renderContent ? (
          <View accessibilityRole={AccessibilityRole.STATUS}>
            <SnackBarContainer
              isVisible={isVisible}
              marginTop={top}
              testID="snackbar-container"
              accessibilityHidden={!isVisible}>
              {Icon ? (
                <Icon testID="snackbar-icon" color={designSystem.color.icon[props.color]} />
              ) : null}
              <Spacer.Flex flex={1}>
                <StyledBody testID="snackbar-message" color={props.color}>
                  {props.message}
                </StyledBody>
              </Spacer.Flex>
              <Touchable
                accessibilityLabel={`Supprimer le message\u00a0: ${props.message}`}
                onPress={onClose}>
                <Close color={designSystem.color.icon[props.color]} />
              </Touchable>
            </SnackBarContainer>
          </View>
        ) : null}
        {renderProgressBar()}
      </ColoredAnimatedView>
    </RootContainer>
  )
}

export const SnackBar = memo(SnackBarBase)

/*
  Display rules :
  - On mobile : at the very top of the screen, with a full width
  - On tablet or desktop : below top menu on the right side of the screen, with a max width
*/
const RootContainer = styled.View(({ theme }) => ({
  maxWidth: theme.isMobileViewport ? '100%' : getSpacing(100),
  position: 'absolute',
  top: theme.isMobileViewport ? 0 : theme.navTopHeight,
  left: theme.isMobileViewport ? 0 : 'auto',
  right: 0,
  zIndex: theme.zIndex.snackbar,
}))

const ColoredAnimatedView = styled(Animated.View)<{ backgroundColor: ColorsType }>((props) => ({
  backgroundColor: props.backgroundColor,
}))

const SnackBarContainer = styled.View<{ isVisible: boolean; marginTop: number }>(
  ({ isVisible, marginTop, theme }) => ({
    marginTop,
    flexDirection: 'row',
    alignItems: 'center',
    display: isVisible ? 'flex' : 'none',
    paddingTop: getSpacing(2) - marginTop,
    paddingBottom: theme.designSystem.size.spacing.s,
    paddingHorizontal: getSpacing(5),
  })
)

const StyledBody = styled(Typo.Body)({
  marginHorizontal: getSpacing(3),
  flexGrow: 0,
  flexWrap: 'wrap',
})

const Close = memo(
  styled(CloseFilled).attrs(({ theme }) => ({
    size: theme.icons.sizes.smaller,
  }))``
)
