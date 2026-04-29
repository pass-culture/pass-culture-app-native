import React from 'react'
import styled from 'styled-components/native'

import { TabScreens } from 'features/navigation/TabBar/isTabNavigatorScreen'
import { menu } from 'features/navigation/TabBar/menu'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { LogoDetailed } from 'ui/svg/icons/LogoDetailed'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

interface NavItemInterface {
  isSelected?: boolean
  BicolorIcon: React.FC<AccessibleIcon>
  navigateTo: InternalNavigationProps['navigateTo']
  tabName: TabScreens
  badgeValue?: number
  onBeforeNavigate?: () => void
}

export const NavItem: React.FC<NavItemInterface> = ({
  BicolorIcon,
  navigateTo,
  tabName,
  isSelected,
  badgeValue,
  onBeforeNavigate,
}) => {
  const accessibilityLabel = menu[tabName].accessibilityLabel ?? menu[tabName].displayName

  return (
    <StyledTouchableLink
      isSelected={isSelected}
      navigateTo={navigateTo}
      activeOpacity={1}
      on
      testID={`${tabName} tab`}
      onBeforeNavigate={onBeforeNavigate}
      accessibilityCurrent={isSelected ? 'page' : undefined}
      accessibilityLabel={accessibilityLabel}>
      <IconWrapper>
        <StyledIcon as={BicolorIcon} selected={isSelected} badgeValue={badgeValue} />
      </IconWrapper>
      <Title isSelected={isSelected}>{menu[tabName].displayName}</Title>
    </StyledTouchableLink>
  )
}

const StyledIcon = styled(LogoDetailed).attrs<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected
    ? theme.designSystem.color.icon.brandPrimary
    : theme.designSystem.color.icon.disabled,
  size: theme.icons.sizes.small,
  thin: !selected,
}))<{ selected?: boolean }>``

const StyledTouchableLink = styled(InternalTouchableLink).attrs<{ isSelected?: boolean }>(
  ({ theme, isSelected }) => ({
    hoverUnderlineColor: isSelected
      ? theme.designSystem.color.text.brandPrimary
      : theme.designSystem.color.text.default,
  })
)<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',
  height: theme.designSystem.size.spacing.xxxxl,
  paddingHorizontal: theme.designSystem.size.spacing.l,
  borderWidth: 1,
  borderColor: isSelected
    ? theme.designSystem.color.border.brandPrimary
    : theme.designSystem.color.icon.inverted,
  borderRadius: theme.designSystem.size.borderRadius.pill,
}))

const Title = styled(Typo.BodyAccent)<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  marginLeft: 12,
  color: isSelected
    ? theme.designSystem.color.text.brandPrimary
    : theme.designSystem.color.text.default,
}))

const IconWrapper = styled.View({
  position: 'relative',
})
