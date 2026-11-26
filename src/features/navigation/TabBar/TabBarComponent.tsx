import React from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { TabScreens } from 'features/navigation/TabBar/isTabNavigatorScreen'
import { mapTabRouteToIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { menu } from 'features/navigation/TabBar/menu'
import { TabBarInnerComponent } from 'features/navigation/TabBar/TabBarInnerComponent'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

interface Props {
  isSelected?: boolean
  badgeValue?: number
  showFavoritesChip?: boolean
  navigateTo: InternalNavigationProps['navigateTo']
  enableNavigate?: boolean
  onPress?: () => void
  tabName: TabScreens
}

const isWeb = Platform.OS === 'web'

export const TabBarComponent: React.FC<Props> = ({
  isSelected,
  navigateTo,
  enableNavigate = true,
  onPress,
  tabName,
  badgeValue,
  showFavoritesChip = false,
}) => {
  const { tabBar } = useTheme()
  const BicolorIcon = mapTabRouteToIcon({ route: tabName })
  const shouldAnnounceFavoriteChip = tabName === 'Favorites' && showFavoritesChip
  const accessibilityLabelSelected = isSelected ? 'actif' : 'inactif'
  const accessibilityLabel = [
    menu[tabName].accessibilityLabel ?? '',
    shouldAnnounceFavoriteChip ? 'nouveau' : accessibilityLabelSelected,
  ]
    .filter(Boolean)
    .join(' - ')

  return (
    <TabComponentContainer
      navigateTo={navigateTo}
      enableNavigate={enableNavigate}
      onBeforeNavigate={onPress}
      selected={isSelected}
      accessibilityLabel={
        tabBar.showLabels && isWeb && !shouldAnnounceFavoriteChip ? undefined : accessibilityLabel
      }
      testID={menu[tabName].accessibilityLabel ?? menu[tabName].displayName}
      accessibilityCurrent={isSelected ? 'page' : undefined}>
      <TabBarInnerComponent
        tabName={tabName}
        isSelected={isSelected}
        BicolorIcon={BicolorIcon}
        badgeValue={badgeValue}
        showFavoritesChip={shouldAnnounceFavoriteChip}
      />
    </TabComponentContainer>
  )
}

const TabComponentContainer: typeof InternalTouchableLink = styled(InternalTouchableLink).attrs(
  ({ theme, selected }) => ({
    hoverUnderlineColor: selected
      ? theme.designSystem.color.text.default
      : theme.designSystem.color.text.subtle,
  })
)(({ theme }) => ({
  alignItems: 'center',
  height: theme.tabBar.height,
  flex: 1,
}))
