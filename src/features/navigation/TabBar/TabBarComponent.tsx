import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { mapTabRouteToBicolorIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { menu } from 'features/navigation/TabBar/menu'
import { TabBarInnerComponent } from 'features/navigation/TabBar/TabBarInnerComponent'
import { TabBarInnerComponentV2 } from 'features/navigation/TabBar/TabBarInnerComponentV2'
import { TabRouteName } from 'features/navigation/TabBar/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

interface Props {
  v2: boolean
  isSelected?: boolean
  navigateTo: InternalNavigationProps['navigateTo']
  enableNavigate?: boolean
  onPress?: () => void
  tabName: TabRouteName
}

const isWeb = Platform.OS === 'web'

export const TabBarComponent: React.FC<Props> = ({
  v2,
  isSelected,
  navigateTo,
  enableNavigate = true,
  onPress,
  tabName,
}) => {
  const BicolorIcon = mapTabRouteToBicolorIcon(tabName, v2)
  const InnerComponent = v2 ? TabBarInnerComponentV2 : TabBarInnerComponent

  return (
    <TabComponentContainer
      navigateTo={navigateTo}
      enableNavigate={enableNavigate}
      onBeforeNavigate={onPress}
      selected={isSelected}
      accessibilityLabel={menu[tabName].accessibilityLabel}
      testID={menu[tabName].accessibilityLabel ?? menu[tabName].displayName}
      accessibilityCurrent={isSelected ? 'page' : undefined}
      v2={v2}>
      <InnerComponent tabName={tabName} isSelected={isSelected} BicolorIcon={BicolorIcon} />
    </TabComponentContainer>
  )
}

const TabComponentContainer: typeof InternalTouchableLink = styled(InternalTouchableLink).attrs(
  ({ theme, accessibilityLabel, selected, v2 }) => ({
    accessibilityLabel: theme.tabBar.showLabels && isWeb && !v2 ? undefined : accessibilityLabel,
    hoverUnderlineColor: selected ? theme.colors.black : theme.colors.greyDark,
  })
)(({ theme }) => ({
  alignItems: 'center',
  height: theme.tabBar.height,
  flex: 1,
}))
