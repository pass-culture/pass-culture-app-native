import React, { useMemo } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ExternalSite as ExternalSiteIcon } from 'ui/svg/icons/ExternalSite'

type CTAButtonProps = {
  wording: string
  onPress?: () => void
  isDisabled?: boolean
  externalNav?: ExternalNavigationProps['externalNav']
  navigateTo?: InternalNavigationProps['navigateTo']
  isFreeDigitalOffer?: boolean
}

export function CTAButton({
  wording,
  onPress,
  isDisabled,
  externalNav,
  navigateTo,
  isFreeDigitalOffer,
}: CTAButtonProps) {
  const { isLoggedIn } = useAuthContext()
  const commonLinkProps = {
    as: ButtonWithLinearGradient,
    wording: wording,
    onBeforeNavigate: onPress,
    isDisabled: isDisabled,
    isOnPressDebounced: true,
  }

  const buttonIcon = useMemo(
    () => (isFreeDigitalOffer && isLoggedIn ? ExternalSiteIcon : undefined),
    [isFreeDigitalOffer, isLoggedIn]
  )

  if (navigateTo) {
    return <InternalTouchableLink navigateTo={navigateTo} {...commonLinkProps} />
  }
  if (externalNav) {
    return (
      <ExternalTouchableLink
        externalNav={externalNav}
        icon={ExternalSiteIcon}
        {...commonLinkProps}
      />
    )
  }
  return (
    <ButtonWithLinearGradient
      wording={wording}
      onPress={onPress}
      isDisabled={isDisabled}
      icon={buttonIcon}
    />
  )
}
