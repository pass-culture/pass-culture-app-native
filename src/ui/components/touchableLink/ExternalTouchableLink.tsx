import React, { FunctionComponent } from 'react'

import { openUrl } from 'features/navigation/helpers'
import { useItinerary } from 'libs/itinerary/useItinerary'
import { TouchableLink2 } from 'ui/components/touchableLink/TouchableLink2'
import { ExternalTouchableLinkProps } from 'ui/components/touchableLink/types'

export const ExternalTouchableLink: FunctionComponent<ExternalTouchableLinkProps> = ({
  externalNav,
  ...rest
}) => {
  const { navigateTo: navigateToItinerary } = useItinerary()
  const { url, params, address, onSuccess, onError } = externalNav
  const handleNavigation = () => {
    if (address) {
      navigateToItinerary(address)
    } else {
      openUrl(url, params).then(onSuccess).catch(onError)
    }
  }
  return (
    <TouchableLink2
      handleNavigation={handleNavigation}
      linkProps={{ href: externalNav.url, target: '_blank' }}
      {...rest}
    />
  )
}
