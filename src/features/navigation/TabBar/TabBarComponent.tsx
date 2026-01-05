import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
const DARK_MODE_BADGE_STORAGE_KEY = 'darkModeGtmProfileBadgeSeen'

export const TabBarComponent: React.FC<Props> = ({
  isSelected,
  navigateTo,
  enableNavigate = true,
  onPress,
  tabName,
  badgeValue,
}) => {
  const enableDarkModeGtm = useFeatureFlag(RemoteStoreFeatureFlags.DARK_MODE_GTM)
  const [hasSeenProfileBadge, setHasSeenProfileBadge] = useState<boolean | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const fetchBadgeState = async () => {
      if (!enableDarkModeGtm || tabName !== 'Profile') {
        setHasSeenProfileBadge(null)
        return
      }
      const stored = await AsyncStorage.getItem(DARK_MODE_BADGE_STORAGE_KEY)
      if (!isMounted.current) return
      setHasSeenProfileBadge(stored === 'true')
    }

    fetchBadgeState()
    return () => {
      isMounted.current = false
    }
  }, [enableDarkModeGtm, tabName])

  const markBadgeAsSeen = useCallback(() => {
    if (tabName !== 'Profile' || !enableDarkModeGtm) return
    setHasSeenProfileBadge(true)
    AsyncStorage.setItem(DARK_MODE_BADGE_STORAGE_KEY, 'true').catch(() => null)
  }, [enableDarkModeGtm, tabName])

  const BicolorIcon = mapTabRouteToIcon({ route: tabName })
  const accessibilityLabelSelected = isSelected ? 'actif' : 'inactif'
  const showProfileBadge =
    enableDarkModeGtm && tabName === 'Profile' && hasSeenProfileBadge === false
  const accessibilityLabel = `${menu[tabName].accessibilityLabel} - ${accessibilityLabelSelected}${
    showProfileBadge ? ' - nouvelle fonctionnalité disponible' : ''
  }`

  const handlePress = useCallback(() => {
    markBadgeAsSeen()
    onPress?.()
  }, [markBadgeAsSeen, onPress])

  return (
    <TabComponentContainer
      navigateTo={navigateTo}
      enableNavigate={enableNavigate}
      onBeforeNavigate={handlePress}
      selected={isSelected}
      accessibilityLabel={accessibilityLabel}
      testID={menu[tabName].accessibilityLabel ?? menu[tabName].displayName}
      accessibilityCurrent={isSelected ? 'page' : undefined}>
      <TabBarInnerComponent
        tabName={tabName}
        isSelected={isSelected}
        BicolorIcon={BicolorIcon}
        badgeValue={badgeValue}
        showBadge={showProfileBadge}
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
