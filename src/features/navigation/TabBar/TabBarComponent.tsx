import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/routes'
import { TabBarTitle as Title } from 'features/navigation/TabBar/TabBarTitle'
import { TabRouteName } from 'features/navigation/TabBar/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorSelector } from 'ui/svg/icons/BicolorSelector'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { Spacer, getSpacing } from 'ui/theme'

const SELECTOR_WIDTH = '80%'
const SELECTOR_HEIGHT = getSpacing(1)

interface Props {
  isSelected?: boolean
  BicolorIcon: React.FC<BicolorIconInterface>
  navigateTo: InternalNavigationProps['navigateTo']
  enableNavigate?: boolean
  onPress?: () => void
  tabName: TabRouteName
}

const isWeb = Platform.OS === 'web'

export const TabBarComponent: React.FC<Props> = ({
  isSelected,
  BicolorIcon,
  navigateTo,
  enableNavigate = true,
  onPress,
  tabName,
}) => (
  <TabComponentContainer
    navigateTo={navigateTo}
    enableNavigate={enableNavigate}
    onBeforeNavigate={onPress}
    activeOpacity={1}
    selected={isSelected}
    accessibilityLabel={menu[tabName].accessibilityLabel}
    testID={menu[tabName].accessibilityLabel || menu[tabName].displayName}
    aria-current={isSelected ? 'page' : undefined}>
    {!!isSelected && (
      <BicolorSelector
        width={SELECTOR_WIDTH}
        height={SELECTOR_HEIGHT}
        testID={`${menu[tabName].accessibilityLabel} sélectionné`}
      />
    )}
    <Spacer.Flex />
    <StyledIcon as={BicolorIcon} selected={isSelected} />
    <Title selected={isSelected} displayName={menu[tabName].displayName} />
    <Spacer.Flex />
    {!!isSelected && <BicolorSelectorPlaceholder />}
  </TabComponentContainer>
)

const StyledIcon = styled(BicolorLogo).attrs<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? undefined : theme.colors.greyDark,
  size: theme.tabBar.iconSize,
  thin: !selected,
}))<{ selected?: boolean }>``

const BicolorSelectorPlaceholder = styled.View({ height: SELECTOR_HEIGHT })

const TabComponentContainer: typeof InternalTouchableLink = styled(InternalTouchableLink).attrs(
  ({ theme, accessibilityLabel, selected }) => ({
    accessibilityLabel: theme.tabBar.showLabels && isWeb ? undefined : accessibilityLabel,
    hoverUnderlineColor: selected ? theme.colors.black : theme.colors.greyDark,
  })
)(({ theme }) => ({
  alignItems: 'center',
  height: theme.tabBar.height,
  flex: 1,
}))
