import React from 'react'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/routes'
import { accessibilityAndTestId } from 'tests/utils'
import { computeBicolorSelectorHeight } from 'ui/svg/icons/BicolorSelector'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

const SELECTOR_WIDTH = getSpacing(11)
const SELECTOR_HEIGHT = computeBicolorSelectorHeight(SELECTOR_WIDTH)

interface NavItemInterface {
  isSelected?: boolean
  bicolorIcon: React.FC<BicolorIconInterface>
  onPress: () => void
  tabName: string
  height?: number
  isMobile?: boolean
}

export const NavItem: React.FC<NavItemInterface> = ({
  bicolorIcon,
  height,
  onPress,
  tabName,
  isSelected,
}) => {
  const Icon = bicolorIcon
  return (
    <NavItemContainer
      height={height}
      onPress={onPress}
      activeOpacity={1}
      {...accessibilityAndTestId(`${tabName} nav`)}>
      <Wrapper isSelected={isSelected}>
        {!!Icon && (
          <Icon
            color={isSelected ? undefined : ColorsEnum.GREY_DARK}
            size={getSpacing(11)}
            thin={!isSelected}
          />
        )}
        <Title color={isSelected ? ColorsEnum.BRAND : ColorsEnum.BLACK}>{menu[tabName]}</Title>
        {!!isSelected && <BicolorSelectorPlaceholder />}
      </Wrapper>
    </NavItemContainer>
  )
}

const Title = styled(Typo.ButtonText)({
  marginLeft: getSpacing(1),
})

const Wrapper = styled.View<{ isMobile?: boolean; isSelected?: boolean }>(
  ({ theme, isSelected }) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: getSpacing(2),
    paddingVertical: getSpacing(1),
    marginHorizontal: getSpacing(4),
    marginVertical: getSpacing(4),
    borderWidth: isSelected ? 1 : 0,
    borderColor: theme.colors.brand,
    borderRadius: theme.borderRadius.button * 2,
  })
)

const BicolorSelectorPlaceholder = styled.View({
  height: SELECTOR_HEIGHT,
})

const NavItemContainer = styled.TouchableOpacity<{ height?: number }>(({ theme, height }) => ({
  marginTop: -getSpacing(1 / 4),
  height: height ?? theme.tabBarHeight,
  flex: 1,
}))
