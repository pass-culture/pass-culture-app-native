import React from 'react'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/routes'
import { TabRouteName } from 'features/navigation/TabBar/types'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

interface NavItemInterface {
  isSelected?: boolean
  BicolorIcon: React.FC<BicolorIconInterface>
  onPress: () => void
  tabName: TabRouteName
}

export const NavItem: React.FC<NavItemInterface> = ({
  BicolorIcon,
  onPress,
  tabName,
  isSelected,
}) => (
  <StyledTouchableOpacity
    isSelected={isSelected}
    onPress={onPress}
    activeOpacity={1}
    testID={`${tabName} nav`}>
    <StyledIcon as={BicolorIcon} selected={isSelected} />
    <Title isSelected={isSelected}>{menu[tabName].displayName}</Title>
  </StyledTouchableOpacity>
)

const StyledIcon = styled(BicolorLogo).attrs<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? undefined : theme.colors.greyDark,
  size: theme.icons.sizes.small,
  thin: !selected,
}))<{ selected?: boolean }>``

const StyledTouchableOpacity = styled.TouchableOpacity<{ isSelected?: boolean }>(
  ({ theme, isSelected }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    height: getSpacing(11),
    paddingHorizontal: getSpacing(4),
    borderWidth: 1,
    borderColor: isSelected ? theme.uniqueColors.brand : theme.colors.transparent,
    borderRadius: theme.borderRadius.button * 2,
  })
)

const Title = styled(Typo.ButtonText)<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  marginLeft: 12,
  color: isSelected ? theme.uniqueColors.brand : theme.colors.black,
}))
