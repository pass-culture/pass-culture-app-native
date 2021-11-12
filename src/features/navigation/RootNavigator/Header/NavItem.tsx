import React from 'react'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/routes'
import { accessibilityAndTestId } from 'tests/utils'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface NavItemInterface {
  isSelected?: boolean
  BicolorIcon: React.FC<BicolorIconInterface>
  onPress: () => void
  tabName: string
}

export const NavItem: React.FC<NavItemInterface> = ({
  BicolorIcon,
  onPress,
  tabName,
  isSelected,
}) => {
  return (
    <StyledTouchableOpacity
      isSelected={isSelected}
      onPress={onPress}
      activeOpacity={1}
      {...accessibilityAndTestId(`${tabName} nav`)}>
      <BicolorIcon
        color={isSelected ? undefined : ColorsEnum.GREY_DARK}
        size={getSpacing(6)}
        thin={!isSelected}
      />
      <Title color={isSelected ? ColorsEnum.BRAND : ColorsEnum.BLACK}>{menu[tabName]}</Title>
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled.TouchableOpacity<{ isSelected?: boolean }>(
  ({ theme, isSelected }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    height: getSpacing(11),
    paddingHorizontal: getSpacing(4),
    borderWidth: isSelected ? 1 : 0,
    borderColor: theme.colors.brand,
    borderRadius: theme.borderRadius.button * 2,
  })
)

const Title = styled(Typo.ButtonText)({ marginLeft: 12 })
