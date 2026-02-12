import React, { FunctionComponent, useMemo } from 'react'

import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Button } from 'ui/designSystem/Button/Button'
import { ExternalSiteFilled as ExternalSiteFilledIcon } from 'ui/svg/icons/ExternalSiteFilled'

type Props = {
  wording: string
  onPress?: () => void
  isDisabled?: boolean
  externalNav?: ExternalNavigationProps['externalNav']
  navigateTo?: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
  isFreeDigitalOffer?: boolean
  isLoggedIn?: boolean
}

export const CTAButton: FunctionComponent<Props> = ({
  wording,
  onPress,
  isDisabled,
  externalNav,
  navigateTo,
  isFreeDigitalOffer,
  isLoggedIn,
  onBeforeNavigate,
}) => {
  const commonLinkProps = {
    as: Button,
    wording: wording,
    onBeforeNavigate: onBeforeNavigate ?? onPress,
    isDisabled: isDisabled,
    isOnPressDebounced: true,
  }

  const buttonIcon = useMemo(
    () => (isFreeDigitalOffer && isLoggedIn ? ExternalSiteFilledIcon : undefined),
    [isFreeDigitalOffer, isLoggedIn]
  )

  if (navigateTo) {
    return <InternalTouchableLink navigateTo={navigateTo} {...commonLinkProps} />
  }
  if (externalNav) {
    return (
      <ExternalTouchableLink
        externalNav={externalNav}
        icon={ExternalSiteFilledIcon}
        {...commonLinkProps}
      />
    )
  }

  return <Button wording={wording} onPress={onPress} disabled={isDisabled} icon={buttonIcon} />
}
