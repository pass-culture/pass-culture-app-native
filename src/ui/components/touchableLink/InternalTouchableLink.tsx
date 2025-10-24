import { CommonActions, StackActions } from '@react-navigation/native'
import React from 'react'
import { Platform } from 'react-native'

import { navigationRef } from 'features/navigation/navigationRef'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'

const isWeb = Platform.OS === 'web'

export function InternalTouchableLink<RouteName extends keyof RootStackParamList>({
  navigateTo,
  enableNavigate = true,
  onBeforeNavigate,
  onAfterNavigate,
  ...rest
}: InternalTouchableLinkProps<RouteName>) {
  const internalLinkProps:
    | { href: string; accessibilityRole: 'link'; onPress: () => void }
    | undefined = isWeb
    ? {
        href: getScreenPath(navigateTo.screen, navigateTo.params),
        accessibilityRole: 'link',
        onPress: () => {},
      }
    : undefined

  const handleNavigation = () => {
    if (navigationRef.isReady()) {
      if (navigateTo.withReset) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: navigateTo.screen, params: navigateTo.params }],
          })
        )
      } else if (navigateTo.withPush) {
        navigationRef.dispatch(StackActions.push(navigateTo.screen, navigateTo.params))
      } else {
        navigationRef.dispatch(
          CommonActions.navigate({ name: navigateTo.screen, params: navigateTo.params })
        )
      }
    }
  }

  const accessibilityRole = isWeb ? AccessibilityRole.LINK : AccessibilityRole.BUTTON

  return (
    <TouchableLink
      accessibilityRole={accessibilityRole}
      handleNavigation={enableNavigate ? handleNavigation : undefined}
      onBeforeNavigate={onBeforeNavigate}
      onAfterNavigate={onAfterNavigate}
      linkProps={internalLinkProps}
      {...rest}
    />
  )
}
