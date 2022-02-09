import React from 'react'
import { Animated, TouchableOpacity } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { AnimatedIcon as DefaultAnimatedIcon } from 'ui/components/AnimatedIcon'
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
  initialColor?: ColorsEnum | undefined
  onPress: () => void
  scaleAnimatedValue?: Animated.Value
  animationState: {
    iconBackgroundColor: Animated.AnimatedInterpolation
    iconBorderColor: Animated.AnimatedInterpolation
    transition: Animated.AnimatedInterpolation
  }
  testID: string
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
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={props.onPress}
      {...accessibilityAndTestId(props.testID)}>
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
    </TouchableOpacity>
  )
}

const StyledAnimatedView = styled(Animated.View)(({ theme }) => ({
  width: getSpacing(10),
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
