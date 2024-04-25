import React, { useCallback } from 'react'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { useItinerary } from 'libs/itinerary/useItinerary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalTouchableLinkProps } from 'ui/components/touchableLink/types'

export function ExternalTouchableLink({
  externalNav,
  openInNewWindow = true,
  ...rest
}: ExternalTouchableLinkProps) {
  const { navigateTo: navigateToItinerary } = useItinerary()
  const handleNavigation = useCallback(() => {
    const { url, params, address, onSuccess, onError } = externalNav
    if (address) {
      navigateToItinerary(address)
    } else {
      openUrl(url, params, openInNewWindow).then(onSuccess).catch(onError)
    }
  }, [externalNav, openInNewWindow, navigateToItinerary])
  return (
    <TouchableLink
      handleNavigation={handleNavigation}
      linkProps={{ href: externalNav.url, target: '_blank' }}
      {...rest}
    />
  )
}
