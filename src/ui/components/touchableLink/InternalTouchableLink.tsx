import { useLinkProps, useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'

import { pushFromRef, navigateFromRef } from 'features/navigation/navigationRef'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'

export const InternalTouchableLink: FunctionComponent<InternalTouchableLinkProps> = ({
  navigateTo,
  enableNavigate = true,
  ...rest
}) => {
  // We use nullish operator here because TabBar uses InteralTouchableLink but navigateTo is undefined during launch
  const internalLinkProps = useLinkProps({ to: navigateTo ?? '' })
  const { navigate, push } = useNavigation<UseNavigationType>()
  const handleNavigation = useCallback(() => {
    if (enableNavigate) {
      const { screen, params, fromRef, withPush } = navigateTo
      if (withPush) {
        fromRef ? pushFromRef(screen, params) : push(screen, params)
      } else {
        fromRef ? navigateFromRef(screen, params) : navigate(screen, params)
      }
    }
  }, [enableNavigate, navigateTo, push, navigate])
  return (
    <TouchableLink handleNavigation={handleNavigation} linkProps={internalLinkProps} {...rest} />
  )
}
