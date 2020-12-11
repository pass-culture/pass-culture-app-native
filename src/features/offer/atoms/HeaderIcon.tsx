import React from 'react'
import { Animated, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { AnimatedIcon } from 'ui/components/AnimatedIcon'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { BicolorFavorite } from 'ui/svg/icons/BicolorFavorite'
import { Share } from 'ui/svg/icons/Share'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing } from 'ui/theme'

interface HeaderIconProps {
  iconName: 'back' | 'share' | 'favorite'
  onPress: () => void
  animationState: {
    iconBackgroundColor: Animated.AnimatedInterpolation
    iconBorderColor: Animated.AnimatedInterpolation
    transition: Animated.AnimatedInterpolation
  }
}

const getIcon = (iconName: HeaderIconProps['iconName']): React.ElementType<IconInterface> => {
  if (iconName === 'back') return ArrowPrevious
  if (iconName === 'share') return Share
  return BicolorFavorite
}

export const HeaderIcon = ({ iconName, onPress, animationState }: HeaderIconProps) => {
  const Icon = getIcon(iconName)

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <RoundContainer
        testID="headerIconRoundContainer"
        animationState={animationState}
        style={{
          borderColor: animationState.iconBorderColor,
          backgroundColor: animationState.iconBackgroundColor,
        }}>
        <AnimatedIcon
          Icon={Icon}
          size={getSpacing(8)}
          initialColor={ColorsEnum.BLACK}
          testID={`icon-${iconName}`}
          transition={animationState.transition}
          finalColor={ColorsEnum.WHITE}
        />
      </RoundContainer>
    </TouchableOpacity>
  )
}

const RoundContainer = styled(Animated.View)<Pick<HeaderIconProps, 'animationState'>>(() => ({
  width: getSpacing(10),
  aspectRatio: '1',
  borderRadius: getSpacing(10),
  backgroundColor: ColorsEnum.WHITE,
  border: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: ColorsEnum.GREY_LIGHT,
}))
