import React, { useCallback, useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import LottieView from 'libs/lottie'
import NotificationAnimation from 'ui/animations/notif_basic_medium.json'
import { ANIMATION_USE_NATIVE_DRIVER } from 'ui/components/animationUseNativeDriver'
import { ToggleButton, ToggleButtonSize } from 'ui/components/buttons/ToggleButton'

type Activable<T> = {
  active: T
  inactive: T
}

type Props = {
  active: boolean
  onPress: () => void
  label: Activable<string>
  size?: ToggleButtonSize
}

export const SubscribeButton = ({ active, onPress, label, size }: Props) => {
  const shouldAnimateIcon = useRef(false)
  const animationProgress = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: active ? 1 : 0,
      duration: active && shouldAnimateIcon.current ? 1000 : 0,
      useNativeDriver: ANIMATION_USE_NATIVE_DRIVER,
    }).start()
  }, [active])

  const onPressWithAnimation = useCallback(() => {
    // We animate when user interacts with the button, not when the page is first rendered
    shouldAnimateIcon.current = true
    onPress()
  }, [onPress])

  const AnimatedBellIcon = useCallback(
    () => (
      <StyledLottieView
        progress={animationProgress.current}
        source={NotificationAnimation}
        loop={false}
      />
    ),
    []
  )

  return (
    <ToggleButton
      active={active}
      onPress={onPressWithAnimation}
      label={label}
      accessibilityLabel={{ active: 'Thème déjà suivi', inactive: 'Suivre le thème' }}
      Icon={{ active: AnimatedBellIcon, inactive: AnimatedBellIcon }}
      size={size}
    />
  )
}

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView)
const StyledLottieView = styled(AnimatedLottieView)(({ theme }) => ({
  width: theme.icons.sizes.small,
  height: theme.icons.sizes.small,
}))
