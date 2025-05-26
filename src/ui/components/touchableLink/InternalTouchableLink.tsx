import { useLinkProps, useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'

import { pushFromRef, navigateFromRef, resetFromRef } from 'features/navigation/navigationRef'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'

export const InternalTouchableLink: FunctionComponent<InternalTouchableLinkProps> = ({
  navigateTo,
  enableNavigate = true,
  onBeforeNavigate,
  onAfterNavigate,
  ...rest
}) => {
  // We use nullish operator here because TabBar uses InternalTouchableLink but navigateTo is undefined during launch
  const internalLinkProps = useLinkProps({ to: navigateTo ?? '' })
  const { navigate, push, reset } = useNavigation<UseNavigationType>()
  const { screen, params, fromRef, withPush, withReset } = navigateTo

  const handleNavigation = useCallback(() => {
    if (withReset) {
      fromRef
        ? resetFromRef(screen, params)
        : reset({ index: 0, routes: [{ name: screen, params }] })
    } else if (withPush) {
      fromRef ? pushFromRef(screen, params) : push(screen, params)
    } else {
      fromRef ? navigateFromRef(screen, params) : navigate(screen, params)
    }
  }, [navigate, push, reset, fromRef, withPush, withReset, params, screen])
  return (
    <TouchableLink
      handleNavigation={enableNavigate ? handleNavigation : undefined}
      onBeforeNavigate={onBeforeNavigate}
      onAfterNavigate={onAfterNavigate}
      linkProps={internalLinkProps}
      {...rest}
    />
  )
}
