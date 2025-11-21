import { useLinkProps, useNavigation, LinkProps } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useMemo } from 'react'
import { Platform } from 'react-native'

import { pushFromRef, navigateFromRef, resetFromRef } from 'features/navigation/navigationRef'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'

const isWeb = Platform.OS === 'web'

function toLinkProps<T extends keyof RootStackParamList>(
  screen: T,
  params?: RootStackParamList[T]
): LinkProps<RootStackParamList, T> {
  return { screen, params } as LinkProps<RootStackParamList, T>
}

export const InternalTouchableLink: FunctionComponent<InternalTouchableLinkProps> = ({
  navigateTo,
  enableNavigate = true,
  onBeforeNavigate,
  onAfterNavigate,
  ...rest
}) => {
  const { navigate, push, reset } = useNavigation<UseNavigationType>()
  const { screen, params, fromRef, withPush, withReset } = navigateTo

  const linkConfig = useMemo(
    () => (navigateTo ? toLinkProps(screen, params) : toLinkProps('TabNavigator' as const)),
    [navigateTo, screen, params]
  )
  const internalLinkProps = useLinkProps<RootStackParamList>(linkConfig)

  const handleNavigation = useCallback(() => {
    if (withReset) {
      fromRef
        ? resetFromRef(screen as keyof RootStackParamList, params)
        : reset({ index: 0, routes: [{ name: screen, params }] })
    } else if (withPush) {
      if (fromRef) {
        pushFromRef(screen as keyof RootStackParamList, params)
      } else {
        // TypeScript cannot verify union types match navigate's overloaded signature
        // but types are correct at runtime - screen and params are validated at call site
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        push(screen as any, params as any)
      }
    } else {
      if (fromRef) {
        navigateFromRef(screen as keyof RootStackParamList, params)
      } else {
        // TypeScript cannot verify union types match navigate's overloaded signature
        // but types are correct at runtime - screen and params are validated at call site
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigate(screen as any, params as any)
      }
    }
  }, [navigate, push, reset, fromRef, withPush, withReset, params, screen])

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
