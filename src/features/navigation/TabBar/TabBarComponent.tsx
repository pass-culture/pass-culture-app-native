import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { mapTabRouteToIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { menu } from 'features/navigation/TabBar/menu'
import { TabBarInnerComponent } from 'features/navigation/TabBar/TabBarInnerComponent'
import { TabRouteName } from 'features/navigation/TabBar/TabStackNavigatorTypes'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

interface Props {
  isSelected?: boolean
  badgeValue?: number
  navigateTo: InternalNavigationProps['navigateTo']
  enableNavigate?: boolean
  onPress?: () => void
  tabName: TabRouteName
}

const isWeb = Platform.OS === 'web'

export const TabBarComponent: React.FC<Props> = ({
  isSelected,
  navigateTo,
  enableNavigate = true,
  onPress,
  tabName,
  badgeValue,
}) => {
  const enableReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const BicolorIcon = mapTabRouteToIcon({ route: tabName, enableReactionFeature })
  const accessibilityLabelSelected = isSelected ? 'actif' : 'inactif'
  const accessibilityLabel = `${menu[tabName].accessibilityLabel} - ${accessibilityLabelSelected}`

  return (
    <TabComponentContainer
      navigateTo={navigateTo}
      enableNavigate={enableNavigate}
      onBeforeNavigate={onPress}
      selected={isSelected}
      accessibilityLabel={accessibilityLabel}
      testID={menu[tabName].accessibilityLabel ?? menu[tabName].displayName}
      accessibilityCurrent={isSelected ? 'page' : undefined}>
      <TabBarInnerComponent
        tabName={tabName}
        isSelected={isSelected}
        BicolorIcon={BicolorIcon}
        badgeValue={badgeValue}
      />
    </TabComponentContainer>
  )
}

const TabComponentContainer: typeof InternalTouchableLink = styled(InternalTouchableLink).attrs(
  ({ theme, accessibilityLabel, selected }) => ({
    accessibilityLabel: theme.tabBar.showLabels && isWeb ? undefined : accessibilityLabel,
    hoverUnderlineColor: selected
      ? theme.designSystem.color.text.default
      : theme.designSystem.color.text.subtle,
  })
)(({ theme }) => ({
  alignItems: 'center',
  height: theme.tabBar.height,
  flex: 1,
}))
