import React, {
  FunctionComponent,
  useRef,
  useEffect,
  RefObject,
  useCallback,
  useState,
  memo,
} from 'react'
import { Platform, View, ViewProps, ViewStyle } from 'react-native'
import { AnimatableProperties, View as AnimatableView } from 'react-native-animatable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { SnackBarProgressBar } from 'ui/components/snackBar/SnackBarProgressBar'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Close as DefaultClose } from 'ui/svg/icons/Close'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type RefType = RefObject<
  React.Component<AnimatableProperties<ViewStyle> & ViewProps, never, never> & {
    fadeOutUp: (duration: number) => Promise<void>
    fadeInDown: (duration: number) => Promise<void>
  }
> | null

export type SnackBarProps = {
  visible: boolean
  message: string
  icon: FunctionComponent<AccessibleIcon> | undefined
  onClose?: () => void
  timeout?: number
  backgroundColor: ColorsEnum
  progressBarColor: ColorsEnum
  color: ColorsEnum
  animationDuration?: number
  refresher: number
}

const _SnackBar = (props: SnackBarProps) => {
  const firstRender = useRef(true)
  const animationDuration = props.animationDuration || 500

  const containerRef: RefType = useRef(null)
  const progressBarContainerRef: RefType = useRef(null)
  const [isVisible, setVisible] = useState(props.visible)

  async function triggerApparitionAnimation() {
    setVisible(true)
    progressBarContainerRef?.current?.fadeInDown(animationDuration)
    containerRef?.current?.fadeInDown(animationDuration)
  }
  async function triggerVanishAnimation() {
    progressBarContainerRef?.current?.fadeOutUp(animationDuration)
    containerRef?.current?.fadeOutUp(animationDuration).then(() => {
      setVisible(false)
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onClose = useCallback(() => props.onClose?.(), [])

  const iconLabel = props.visible ? {} : { accessibilityLabel: undefined }
  const Icon =
    !!props.icon &&
    styled(props.icon).attrs(({ theme }) => ({
      size: theme.icons.sizes.small,
      ...iconLabel,
    }))``

  // Visibility effect
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.refresher])

  const { top } = useSafeAreaInsets()

  function renderProgressBar() {
    return (
      <AnimatableView easing="ease" duration={animationDuration} ref={progressBarContainerRef}>
        {isVisible && props.timeout ? (
          <SnackBarProgressBar
            color={props.progressBarColor}
            timeout={props.timeout}
            refresher={props.refresher}
          />
        ) : null}
      </AnimatableView>
    )
  }

  // If in web, always display snackbar content. Else, don't display until needed, then keep mounted (using firstRender)
  const renderContent = Platform.OS === 'web' || !firstRender.current || isVisible
  return (
    <RootContainer>
      <ColoredAnimatableView
        testID="snackbar-view"
        backgroundColor={props.backgroundColor}
        easing="ease"
        duration={animationDuration}
        ref={containerRef}>
        {!!renderContent && (
          <View accessibilityRole={AccessibilityRole.STATUS} aria-relevant="additions">
            <SnackBarContainer isVisible={isVisible} marginTop={top} testID="snackbar-container">
              {!!Icon && <Icon testID="snackbar-icon" color={props.color} />}
              <Spacer.Flex flex={1}>
                <StyledBody testID="snackbar-message" color={props.color}>
                  {props.message}
                </StyledBody>
              </Spacer.Flex>
              <Touchable
                accessibilityLabel={`Supprimer le message\u00a0: ${props.message}`}
                testID="snackbar-close"
                onPress={onClose}>
                <Close color={props.color} />
              </Touchable>
            </SnackBarContainer>
          </View>
        )}
        {renderProgressBar()}
      </ColoredAnimatableView>
    </RootContainer>
  )
}

export const SnackBar = memo(_SnackBar)

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

// Troobleshoot Animated types issue with forwaded 'backgroundColor' prop
const ColoredAnimatableView = styled(AnimatableView)<{ backgroundColor: ColorsEnum }>((props) => ({
  backgroundColor: props.backgroundColor,
}))

const SnackBarContainer = styled.View<{ isVisible: boolean; marginTop: number }>(
  ({ isVisible, marginTop }) => ({
    marginTop,
    flexDirection: 'row',
    alignItems: 'center',
    display: isVisible ? 'flex' : 'none',
    paddingTop: getSpacing(2) - marginTop,
    paddingBottom: getSpacing(2),
    paddingHorizontal: getSpacing(5),
  })
)

const StyledBody = styled(Typo.Body)<{ color: string }>((props) => ({
  color: props.color,
  marginHorizontal: getSpacing(3),
  flexGrow: 0,
  flexWrap: 'wrap',
}))

const Close = memo(
  styled(DefaultClose).attrs(({ theme }) => ({
    size: theme.icons.sizes.smaller,
  }))``
)
