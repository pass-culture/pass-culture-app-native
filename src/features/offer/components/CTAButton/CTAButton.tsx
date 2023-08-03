import React from 'react'

import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'

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
}: CTAButtonProps) {
  const commonLinkProps = {
    as: ButtonWithLinearGradient,
    wording: wording,
    onBeforeNavigate: onPress,
    isDisabled: isDisabled,
    isOnPressDebounced: true,
  }

  if (navigateTo) {
    return <InternalTouchableLink navigateTo={navigateTo} {...commonLinkProps} />
  }
  if (externalNav) {
    return (
      <ExternalTouchableLink externalNav={externalNav} icon={ExternalSite} {...commonLinkProps} />
    )
  }
  return <ButtonWithLinearGradient wording={wording} onPress={onPress} isDisabled={isDisabled} />
}
