import colorAlpha from 'color-alpha'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/menu'
import { TabBarBadge } from 'features/navigation/TabBar/TabBarBadge'
import { TabBarTitle } from 'features/navigation/TabBar/TabBarTitle'
import { TabInnerComponentProps } from 'features/navigation/TabBar/TabStackNavigatorTypes'
import { LogoDetailed } from 'ui/svg/icons/LogoDetailed'
import { Spacer } from 'ui/theme'

export const TabBarInnerComponent: React.FC<TabInnerComponentProps> = ({
  tabName,
  isSelected,
  BicolorIcon,
  badgeValue,
  showBadge,
}) => {
  const accessibilityLabel = menu[tabName].accessibilityLabel
  return (
    <React.Fragment>
      {isSelected ? (
        <Gradient testID={accessibilityLabel ? `${accessibilityLabel} sélectionné` : undefined} />
      ) : null}
      <Spacer.Flex />
      <IconWrapper>
        <StyledIcon
          as={BicolorIcon}
          selected={isSelected}
          badgeValue={showBadge ? undefined : badgeValue}
        />
        {showBadge ? <TabBarBadge testID={`${tabName}-new-feature-badge`} /> : null}
      </IconWrapper>
      <Spacer.Column numberOfSpaces={2.5} />
      <TabBarTitle selected={isSelected} displayName={menu[tabName].displayName} />
      <Spacer.Flex />
      {isSelected ? <BicolorSelectorPlaceholder /> : null}
    </React.Fragment>
  )
}

const Gradient = styled(LinearGradient).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    colorAlpha(theme.designSystem.color.icon.brandPrimary, 0),
    theme.designSystem.color.icon.brandPrimary,
    theme.designSystem.color.icon.brandPrimary,
    colorAlpha(theme.designSystem.color.icon.brandPrimary, 0),
  ],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
}))(({ theme }) => ({ height: theme.designSystem.size.spacing.xxs, width: '100%' }))

const StyledIcon = styled(LogoDetailed).attrs<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected
    ? theme.designSystem.color.icon.brandPrimary
    : theme.designSystem.color.icon.subtle,
  size: theme.icons.sizes.small,
  thin: true,
}))<{ selected?: boolean }>``

const BicolorSelectorPlaceholder = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.xxs,
}))

const IconWrapper = styled.View({
  position: 'relative',
})
