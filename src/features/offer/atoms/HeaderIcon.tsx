import React from 'react'
import styled from 'styled-components/native'

import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { BicolorFavorite } from 'ui/svg/icons/BicolorFavorite'
import { Share } from 'ui/svg/icons/Share'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getShadow, getSpacing } from 'ui/theme'

interface HeaderIconProps {
  iconName: 'back' | 'share' | 'favorite'
  onPress: () => void
}

const getIcon = (iconName: HeaderIconProps['iconName']): React.ElementType<IconInterface> => {
  if (iconName === 'back') return ArrowPrevious
  if (iconName === 'share') return Share
  return BicolorFavorite
}

export const HeaderIcon = ({ iconName, onPress }: HeaderIconProps) => {
  const Icon = getIcon(iconName)

  return (
    <RoundContainer onPress={onPress} activeOpacity={0.5}>
      <Icon size={getSpacing(8)} color={ColorsEnum.BLACK} testID={`icon-${iconName}`} />
    </RoundContainer>
  )
}

const RoundContainer = styled.TouchableOpacity({
  width: getSpacing(10),
  aspectRatio: '1',
  borderRadius: getSpacing(10),
  backgroundColor: ColorsEnum.WHITE,
  border: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: ColorsEnum.GREY_LIGHT,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(1 / 4),
    },
    shadowRadius: getSpacing(1 / 4),
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.15,
  }),
})
