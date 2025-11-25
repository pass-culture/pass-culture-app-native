import React, { useCallback } from 'react'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { openGoogleMapsItinerary } from 'libs/itinerary/openGoogleMapsItinerary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalTouchableLinkProps } from 'ui/components/touchableLink/types'

export function ExternalTouchableLink({
  externalNav,
  openInNewWindow = true,
  ...rest
}: ExternalTouchableLinkProps) {
  const handleNavigation = useCallback(() => {
    const { url, params, address, onSuccess, onError } = externalNav
    if (address) {
      openGoogleMapsItinerary(address)
    } else {
      openUrl(url, params, openInNewWindow).then(onSuccess).catch(onError)
    }
  }, [externalNav, openInNewWindow])
  return (
    <TouchableLink
      accessibilityRole={AccessibilityRole.LINK}
      handleNavigation={handleNavigation}
      linkProps={{ href: externalNav.url, target: '_blank' }}
      {...rest}
    />
  )
}
