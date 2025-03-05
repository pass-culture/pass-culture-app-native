import React from 'react'
import { Platform } from 'react-native'

import { STORE_LINK } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { openUrl } from 'features/navigation/helpers/openUrl'
import {
  RemoteBannerOrigin,
  RemoteBannerRedirectionType,
  RemoteBannerType,
  validateRemoteBanner,
} from 'features/remoteBanners/utils/remoteBannerSchema'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { AccessibleIcon } from 'ui/svg/icons/types'

const isWeb = Platform.OS === 'web'

type RemoteBannerProps = {
  from: RemoteBannerOrigin
  leftIcon: React.FunctionComponent<AccessibleIcon>
  options?: Record<string, unknown>
  logClickEvent: (from: RemoteBannerOrigin, options: RemoteBannerType) => void
  analyticsParams: {
    type: 'remoteActivationBanner' | 'remoteGenericBanner'
    from: 'Profile' | 'Home' | 'Cheatcodes'
  }
}

export const RemoteBanner = ({
  from,
  options,
  leftIcon,
  logClickEvent,
  analyticsParams,
}: RemoteBannerProps) => {
  const validatedOptions = validateRemoteBanner(options)
  if (!validatedOptions) return null

  const { title, subtitleMobile, subtitleWeb, redirectionUrl, redirectionType } = validatedOptions

  const subtitle = isWeb ? subtitleWeb : subtitleMobile

  const isStoreRedirection = redirectionType === RemoteBannerRedirectionType.STORE
  const isExternalRedirection = redirectionType === RemoteBannerRedirectionType.EXTERNAL
  const isExternalAndDefined = isExternalRedirection && redirectionUrl

  const isWebStoreBanner = isStoreRedirection && isWeb
  const accessibilityRole = isWebStoreBanner ? AccessibilityRole.BUTTON : AccessibilityRole.LINK

  const storeAccessibilityLabel = isWebStoreBanner ? '' : `Nouvelle fenêtre\u00a0: ${STORE_LINK}`

  const externalAccessiblityLabel = `Nouvelle fenêtre\u00a0: ${String(redirectionUrl)}`
  const accessibilityLabel = isExternalAndDefined
    ? externalAccessiblityLabel
    : storeAccessibilityLabel

  const onPress = () => {
    logClickEvent(from, validatedOptions)
    if (isStoreRedirection) onPressStoreLink()
    if (isExternalAndDefined) openUrl(redirectionUrl)
  }

  return (
    <SystemBanner
      accessibilityRole={accessibilityRole}
      withBackground
      leftIcon={leftIcon}
      title={title}
      subtitle={subtitle ?? ''}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      analyticsParams={analyticsParams}></SystemBanner>
  )
}
