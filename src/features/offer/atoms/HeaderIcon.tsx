import React from 'react'
import { Animated, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { AnimatedIcon } from 'ui/components/AnimatedIcon'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Favorite } from 'ui/svg/icons/Favorite'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'
import { Share } from 'ui/svg/icons/Share'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing } from 'ui/theme'

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
}

const getIcon = (iconName: HeaderIconProps['iconName']): React.FC<IconInterface> => {
  if (iconName === 'back') return ArrowPrevious
  if (iconName === 'share') return Share
  if (iconName === 'favorite-filled') return FavoriteFilled
  return Favorite
}

export const HeaderIcon = (props: HeaderIconProps) => {
  const Icon = getIcon(props.iconName)

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={props.onPress}>
      <StyledAnimatedView
        testID="headerIconRoundContainer"
        style={{
          borderColor: props.animationState.iconBorderColor,
          backgroundColor: props.animationState.iconBackgroundColor,
          transform: props.scaleAnimatedValue ? [{ scale: props.scaleAnimatedValue }] : undefined,
        }}>
        <AnimatedIcon
          Icon={Icon}
          size={getSpacing(8)}
          initialColor={props.initialColor || ColorsEnum.BLACK}
          testID={`icon-${props.iconName}`}
          transition={props.animationState.transition}
          finalColor={ColorsEnum.WHITE}
        />
      </StyledAnimatedView>
    </TouchableOpacity>
  )
}

const StyledAnimatedView = styled(Animated.View)({
  width: getSpacing(10),
  aspectRatio: '1',
  borderRadius: getSpacing(10),
  backgroundColor: ColorsEnum.WHITE,
  border: 1,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  borderColor: ColorsEnum.GREY_LIGHT,
})
