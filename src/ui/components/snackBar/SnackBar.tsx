import React, {
  FunctionComponent,
  useRef,
  useEffect,
  RefObject,
  useCallback,
  useState,
  memo,
} from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import { AnimatableProperties, View as AnimatableView } from 'react-native-animatable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { ProgressBar } from 'ui/components/snackBar/ProgressBar'
import { Close as DefaultClose } from 'ui/svg/icons/Close'
import { IconInterface } from 'ui/svg/icons/types'
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
  icon: FunctionComponent<IconInterface> | undefined
  onClose?: () => void
  timeout?: number
  backgroundColor: ColorsEnum
  progressBarColor: ColorsEnum
  color: ColorsEnum
  animationDuration?: number
  refresher: number
}

const _SnackBar = (props: SnackBarProps) => {
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

  const onClose = useCallback(() => props.onClose?.(), [])

  const Icon =
    !!props.icon &&
    styled(props.icon).attrs(({ theme }) => ({
      size: theme.icons.sizes.small,
    }))``

  // Visibility effect
  useEffect(() => {
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
  }, [props.refresher])

  const { top } = useSafeAreaInsets()

  function renderProgressBar() {
    return (
      <AnimatableView easing="ease" duration={animationDuration} ref={progressBarContainerRef}>
        {isVisible && props.timeout ? (
          <ProgressBar
            color={props.progressBarColor}
            timeout={props.timeout}
            refresher={props.refresher}
          />
        ) : null}
      </AnimatableView>
    )
  }

  return (
    <RootContainer>
      <ColoredAnimatableView
        testID="snackbar-view"
        backgroundColor={props.backgroundColor}
        easing="ease"
        duration={animationDuration}
        ref={containerRef}>
        <SnackBarContainer isVisible={isVisible} marginTop={top} testID="snackbar-container">
          {!!Icon && <Icon testID="snackbar-icon" color={props.color} />}
          <Spacer.Flex flex={1}>
            <Text testID="snackbar-message" color={props.color}>
              {props.message}
            </Text>
          </Spacer.Flex>
          <TouchableOpacity testID="snackbar-close" onPress={onClose}>
            <Close color={props.color} />
          </TouchableOpacity>
        </SnackBarContainer>
        {renderProgressBar()}
      </ColoredAnimatableView>
    </RootContainer>
  )
}

export const SnackBar = memo(_SnackBar)

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))``

/*
  Display rules :
  - On mobile : at the very top of the screen, with a full width
  - On tablet or desktop : below top menu on the right side of the screen, with a max width
*/
const RootContainer = styled(View)(({ theme }) => ({
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
    paddingTop: getSpacing(2) - marginTop,
    paddingBottom: getSpacing(2),
    paddingHorizontal: getSpacing(5),
    display: isVisible ? 'flex' : 'none',
  })
)

const Text = styled(Typo.Body)<{ color: string }>((props) => ({
  color: props.color,
  marginHorizontal: getSpacing(3),
  flexGrow: 0,
  flexWrap: 'wrap',
}))

const Close = styled(DefaultClose).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
