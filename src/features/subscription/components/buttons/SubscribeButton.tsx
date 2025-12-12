import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import LottieView from 'libs/lottie'
import { patchLottieForTheme } from 'ui/animations/helpers/patchLottieForTheme'
import NotificationAnimation from 'ui/animations/notif_basic_medium.json'
import { ANIMATION_USE_NATIVE_DRIVER } from 'ui/components/animationUseNativeDriver'
import { ToggleButton, ToggleButtonSize } from 'ui/components/buttons/ToggleButton'
import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'

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
  const theme = useTheme()
  const [isAnimatingActivation, setIsAnimatingActivation] = useState(false)

  const animationProgress = useRef(new Animated.Value(0))

  useEffect(() => {
    if (!isAnimatingActivation) return

    animationProgress.current.setValue(0)
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 600,
      useNativeDriver: ANIMATION_USE_NATIVE_DRIVER,
    }).start(() => {
      setIsAnimatingActivation(false)
    })
  }, [isAnimatingActivation])

  const onPressWithAnimation = useCallback(() => {
    // We animate when user interacts with the button, not when the page is first rendered
    if (!active) {
      setIsAnimatingActivation(true)
    }
    onPress()
  }, [active, onPress])

  const InactiveIcon = useCallback(
    () => <Bell size={theme.icons.sizes.small} />,
    [theme.icons.sizes.small]
  )

  const themedAnimation = useMemo(
    () =>
      patchLottieForTheme(NotificationAnimation, {
        fill: theme.designSystem.color.background.brandPrimary,
      }),
    [theme.designSystem.color.background.brandPrimary]
  )

  const ActiveIcon = useCallback(() => {
    if (isAnimatingActivation) {
      return (
        <StyledLottieView
          source={themedAnimation}
          progress={animationProgress.current}
          loop={false}
          renderMode="SOFTWARE" // without this, animation breaks on iOS
        />
      )
    }

    return (
      <BellFilled
        color={theme.designSystem.color.background.brandPrimary}
        size={theme.icons.sizes.small}
      />
    )
  }, [
    isAnimatingActivation,
    themedAnimation,
    theme.designSystem.color.background.brandPrimary,
    theme.icons.sizes.small,
  ])

  return (
    <ToggleButton
      active={active}
      onPress={onPressWithAnimation}
      label={label}
      accessibilityLabel={{
        active: 'Thème déjà suivi',
        inactive: 'Suivre le thème',
      }}
      Icon={{ active: ActiveIcon, inactive: InactiveIcon }}
      size={size}
    />
  )
}

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView)
const StyledLottieView = styled(AnimatedLottieView)(({ theme }) => ({
  width: theme.icons.sizes.small,
  height: theme.icons.sizes.small,
}))
