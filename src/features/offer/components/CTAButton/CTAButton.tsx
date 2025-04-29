import React, { FunctionComponent, useMemo } from 'react'
import { useTheme } from 'styled-components/native'

import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
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
  const { isDesktopViewport } = useTheme()
  const commonLinkProps = {
    as: ButtonWithLinearGradient,
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

  return (
    <ButtonWithLinearGradient
      wording={wording}
      onPress={onPress}
      isDisabled={isDisabled}
      icon={buttonIcon}
      fitContentWidth={isDesktopViewport}
    />
  )
}
