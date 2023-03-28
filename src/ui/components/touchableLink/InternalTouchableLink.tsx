import { useLinkProps, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { isAppUrl, openUrl } from 'features/navigation/helpers'
import { pushFromRef, navigateFromRef } from 'features/navigation/navigationRef'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { eventMonitoring } from 'libs/monitoring'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'

export function InternalTouchableLink({
  navigateTo,
  enableNavigate = true,
  ...rest
}: InternalTouchableLinkProps) {
  // When navigating using in-app urls instead of screen names, we use internalUrl prop (e.g: links from backend).
  const hasInternalUrl = 'internalUrl' in navigateTo
  const linkTo = hasInternalUrl ? '' : navigateTo
  // We use nullish operator here because TabBar uses InteralTouchableLink but navigateTo is undefined during launch
  const internalLinkProps = useLinkProps({ to: linkTo ?? '' })
  // const linkProps = hasInternalUrl ? navigateTo.internalUrl : internalLinkProps
  const { navigate, push } = useNavigation<UseNavigationType>()
  const handleNavigation = useCallback(() => {
    if (enableNavigate) {
      if (!hasInternalUrl) {
        const { screen, params, fromRef, withPush } = navigateTo
        if (withPush) {
          fromRef ? pushFromRef(screen, params) : push(screen, params)
        } else {
          fromRef ? navigateFromRef(screen, params) : navigate(screen, params)
        }
      } else {
        if (navigateTo.internalUrl && isAppUrl(navigateTo.internalUrl)) {
          openUrl(navigateTo.internalUrl)
        } else {
          eventMonitoring.captureException(
            `InternalUrl was not an in-app url: ${navigateTo.internalUrl}`
          )
        }
      }
    }
  }, [enableNavigate, navigateTo, push, navigate, hasInternalUrl])
  //TODO(EveJulliard): virer le navigateTo des deps
  return (
    <TouchableLink handleNavigation={handleNavigation} linkProps={internalLinkProps} {...rest} />
  )
}
