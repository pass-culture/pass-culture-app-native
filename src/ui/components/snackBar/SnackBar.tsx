import React, {
  FunctionComponent,
  useRef,
  useEffect,
  RefObject,
  useCallback,
  useState,
  memo,
} from 'react'
import { Animated, Dimensions, TouchableOpacity, View, ViewProps, ViewStyle } from 'react-native'
import { AnimatableProperties, View as AnimatableView } from 'react-native-animatable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { Close } from 'ui/svg/icons/Close'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
import { ColorsEnum } from 'ui/theme'
import { ZIndexes } from 'ui/theme/layers'

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
  const Icon = props.icon
  const animationDuration = props.animationDuration || 500

  const containerRef: RefType = useRef(null)
  const progressBarContainerRef: RefType = useRef(null)
  const [progressBarWidth] = useState(new Animated.Value(0))
  const [isVisible, setVisible] = useState(props.visible)

  function animateProgressBarWidth() {
    props.timeout &&
      Animated.timing(progressBarWidth, {
        toValue: Dimensions.get('screen').width,
        duration: props.timeout,
        useNativeDriver: false,
      }).start()
  }
  function resetProgressBarWidth() {
    progressBarWidth.setValue(0)
  }
  async function triggerApparitionAnimation() {
    setVisible(true)
    progressBarContainerRef?.current?.fadeInDown(animationDuration)
    containerRef?.current?.fadeInDown(animationDuration).then(() => {
      animateProgressBarWidth()
    })
  }
  async function triggerVanishAnimation() {
    progressBarContainerRef?.current?.fadeOutUp(animationDuration)
    containerRef?.current?.fadeOutUp(animationDuration).then(() => {
      setVisible(false)
      resetProgressBarWidth()
    })
  }

  const onClose = useCallback(() => props.onClose?.(), [])

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
    if (props.visible && isVisible) {
      // the snackbar is still visible but props have been changed
      resetProgressBarWidth()
      animateProgressBarWidth()
    }
    // Timeout section: We want to reset the timer when props are changed
    if (!props.timeout || !props.onClose || shouldHide) {
      return
    }
    const timeout = setTimeout(props.onClose, props.timeout)
    return () => clearTimeout(timeout)
  }, [props.refresher])

  const { top } = useSafeAreaInsets()

  return (
    <RootContainer>
      <ColoredAnimatableView
        testID="snackbar-view"
        backgroundColor={props.backgroundColor}
        easing="ease"
        duration={animationDuration}
        ref={containerRef}>
        <SnackBarContainer isVisible={isVisible} marginTop={top} testID="snackbar-container">
          <React.Fragment>
            <ContentContainer testID="snackbar-content">
              {Icon && <Icon testID="snackbar-icon" size={22} color={props.color} />}
              <Text testID="snackbar-message" color={props.color}>
                {props.message}
              </Text>
            </ContentContainer>
            <TouchableOpacity testID="snackbar-close" onPress={onClose}>
              <Close size={24} color={props.color} />
            </TouchableOpacity>
          </React.Fragment>
        </SnackBarContainer>
      </ColoredAnimatableView>
      <AnimatableView easing="ease" duration={animationDuration} ref={progressBarContainerRef}>
        <ProgressBar
          testID="snackbar-progressbar"
          backgroundColor={props.progressBarColor}
          width={progressBarWidth}
          isVisible={isVisible && !!props?.timeout}
        />
      </AnimatableView>
    </RootContainer>
  )
}

export const SnackBar = memo(_SnackBar)

const RootContainer = styled(View)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: ZIndexes.SNACK_BAR,
})

// Troobleshoot Animated types issue with forwaded 'backgroundColor' prop
const ColoredAnimatableView = styled(AnimatableView)<{ backgroundColor: ColorsEnum }>``

const SnackBarContainer = styled.View<{ isVisible: boolean; marginTop: number }>(
  ({ isVisible, marginTop }) => ({
    marginTop,
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(2),
    flexGrow: 0,
    display: isVisible ? 'flex' : 'none',
  })
)

const ContentContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: getSpacing(1),
})

const Text = styled(Typo.Body)<{ color: string }>(({ color }) => ({
  color,
  marginLeft: getSpacing(3),
  flexGrow: 0,
  maxWidth: Dimensions.get('window').width - getSpacing(20),
  flexWrap: 'wrap',
}))

const ProgressBar = styled(Animated.View)<{
  backgroundColor: ColorsEnum
  isVisible: boolean
  width: Animated.Value
}>(({ backgroundColor, isVisible, width }) => ({
  display: isVisible ? 'flex' : 'none',
  height: 4,
  backgroundColor: backgroundColor,
  // We Ts-ignore to avoid typescript error due to not supported Animated Css/Styles types
  // The alternative is to use inline style
  /* @ts-ignore */
  width: width._value,
}))
