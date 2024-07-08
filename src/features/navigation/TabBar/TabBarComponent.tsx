import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { mapTabRouteToBicolorIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { menu } from 'features/navigation/TabBar/menu'
import { TabBarInnerComponent } from 'features/navigation/TabBar/TabBarInnerComponent'
import { TabBarInnerComponentV2 } from 'features/navigation/TabBar/TabBarInnerComponentV2'
import { TabRouteName } from 'features/navigation/TabBar/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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
  const enableReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const BicolorIcon = mapTabRouteToBicolorIcon({ route: tabName, v2, enableReactionFeature })
  const InnerComponent = v2 ? TabBarInnerComponentV2 : TabBarInnerComponent

  return (
    <TabComponentContainer
      navigateTo={navigateTo}
      enableNavigate={enableNavigate}
      onBeforeNavigate={onPress}
      selected={isSelected}
      accessibilityLabel={menu[tabName].accessibilityLabel}
      testID={menu[tabName].accessibilityLabel ?? menu[tabName].displayName}
      accessibilityCurrent={isSelected ? 'page' : undefined}>
      <InnerComponent tabName={tabName} isSelected={isSelected} BicolorIcon={BicolorIcon} />
    </TabComponentContainer>
  )
}

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
