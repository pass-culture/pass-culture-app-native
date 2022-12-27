import React from 'react'
import { AccessibilityRole, AccessibilityState, Animated } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AnimatedIcon as DefaultAnimatedIcon } from 'ui/components/AnimatedIcon'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Favorite } from 'ui/svg/icons/Favorite'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'
import { Share } from 'ui/svg/icons/Share'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface HeaderIconProps {
  iconName: 'back' | 'share' | 'favorite' | 'favorite-filled'
  initialColor?: ColorsEnum
  onPress: () => void
  scaleAnimatedValue?: Animated.Value
  animationState: {
    iconBackgroundColor: Animated.AnimatedInterpolation
    iconBorderColor: Animated.AnimatedInterpolation
    transition: Animated.AnimatedInterpolation
  }
  accessibilityRole?: AccessibilityRole
  accessibilityState?: AccessibilityState
  accessibilityLabel: string
}

const getIcon = (iconName: HeaderIconProps['iconName']): React.FC<IconInterface> => {
  if (iconName === 'back') return ArrowPrevious
  if (iconName === 'share') return Share
  if (iconName === 'favorite-filled') return FavoriteFilled
  return Favorite
}

export const HeaderIcon = (props: HeaderIconProps) => {
  const Icon = getIcon(props.iconName)
  const { colors } = useTheme()

  return (
    <Touchable
      activeOpacity={0.5}
      onPress={props.onPress}
      accessibilityRole={props.accessibilityRole}
      accessibilityState={props.accessibilityState}
      accessibilityLabel={props.accessibilityLabel}>
      <StyledAnimatedView
        testID="headerIconRoundContainer"
        style={{
          borderColor: props.animationState.iconBorderColor,
          backgroundColor: props.animationState.iconBackgroundColor,
          transform: props.scaleAnimatedValue ? [{ scale: props.scaleAnimatedValue }] : undefined,
        }}>
        <AnimatedIcon
          Icon={Icon}
          initialColor={props.initialColor || colors.black}
          testID={`icon-${props.iconName}`}
          transition={props.animationState.transition}
          finalColor={colors.white}
        />
      </StyledAnimatedView>
    </Touchable>
  )
}

const CONTAINER_SIZE = getSpacing(10)
const StyledAnimatedView = styled(Animated.View)(({ theme }) => ({
  width: CONTAINER_SIZE,
  height: CONTAINER_SIZE,
  aspectRatio: '1',
  borderRadius: getSpacing(10),
  backgroundColor: theme.colors.white,
  border: 1,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  borderColor: theme.colors.greyLight,
}))

const AnimatedIcon = styled(DefaultAnimatedIcon).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
