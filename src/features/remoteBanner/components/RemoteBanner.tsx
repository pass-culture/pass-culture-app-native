import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { STORE_LINK } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { openUrl } from 'features/navigation/helpers/openUrl'
import {
  RemoteBannerRedirectionType,
  validateRemoteBanner,
} from 'features/remoteBanner/components/remoteBannerSchema'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlagOptions } from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { TypoDS } from 'ui/theme'

const isWeb = Platform.OS === 'web'

export type RemoteBannerOrigin = 'Profile' | 'Home' | 'Cheatcodes'

export const RemoteBanner = ({ from }: { from: RemoteBannerOrigin }) => {
  const { options } = useFeatureFlagOptions(RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER)
  const validatedOptions = validateRemoteBanner(options)
  if (!validatedOptions) return null
  const { title, subtitleMobile, subtitleWeb, redirectionUrl, redirectionType } = validatedOptions

  const isStoreRedirection = redirectionType === RemoteBannerRedirectionType.STORE
  const isExternalRedirection = redirectionType === RemoteBannerRedirectionType.EXTERNAL
  const isExternalAndDefined = isExternalRedirection && redirectionUrl

  const isWebStoreBanner = isStoreRedirection && isWeb
  const accessibilityRole = isWebStoreBanner ? AccessibilityRole.BUTTON : AccessibilityRole.LINK

  const externalAccessiblityLabel = `Nouvelle fenêtre\u00a0: ${String(redirectionUrl)}`
  const storeAccessibilityLabel = isWebStoreBanner ? '' : `Nouvelle fenêtre\u00a0: ${STORE_LINK}`

  const accessibilityLabel = isExternalAndDefined
    ? externalAccessiblityLabel
    : storeAccessibilityLabel

  const onPress = () => {
    analytics.logHasClickedRemoteBanner(from, validatedOptions)
    if (isStoreRedirection) onPressStoreLink()
    if (isExternalAndDefined) openUrl(redirectionUrl)
  }

  return (
    <BannerWithBackground
      accessibilityRole={accessibilityRole}
      disabled={!isStoreRedirection && !redirectionUrl}
      leftIcon={ArrowAgain}
      noRightIcon={isWebStoreBanner}
      onPress={onPress}
      {...accessibilityAndTestId(accessibilityLabel)}>
      <StyledButtonText>{title}</StyledButtonText>
      <StyledBodyText>{isWeb ? subtitleWeb : subtitleMobile}</StyledBodyText>
    </BannerWithBackground>
  )
}

const StyledButtonText = styled(TypoDS.Button)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
