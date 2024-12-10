import { useLinkProps, useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'

import { pushFromRef, navigateFromRef } from 'features/navigation/navigationRef'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'

const PUSH_LINK_COOLDOWN = 1500

export const InternalTouchableLink: FunctionComponent<InternalTouchableLinkProps> = ({
  navigateTo,
  enableNavigate = true,
  ...rest
}) => {
  // We use nullish operator here because TabBar uses InternalTouchableLink but navigateTo is undefined during launch
  const internalLinkProps = useLinkProps({ to: navigateTo ?? '' })
  const { navigate, push } = useNavigation<UseNavigationType>()
  const { screen, params, fromRef, withPush } = navigateTo ?? {}
  const handleNavigation = useCallback(() => {
    if (enableNavigate) {
      if (withPush) {
        fromRef ? pushFromRef(screen, params) : push(screen, params)
      } else {
        fromRef ? navigateFromRef(screen, params) : navigate(screen, params)
      }
    }
  }, [enableNavigate, navigate, push, fromRef, withPush, params, screen])
  // For link in push mode, we want to avoid double tap. So we put a pretty large cooldown wait value
  return (
    <TouchableLink
      handleNavigation={handleNavigation}
      linkProps={internalLinkProps}
      {...rest}
      pressCooldownDelay={withPush ? PUSH_LINK_COOLDOWN : undefined}
    />
  )
}
