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
import { useFeatureFlagOptions } from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { TypoDS } from 'ui/theme'

const isWeb = Platform.OS === 'web'

export const RemoteBanner = () => {
  const { options } = useFeatureFlagOptions(RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER)
  const validatedOptions = validateRemoteBanner(options)
  if (!validatedOptions) return null
  const { title, subtitleMobile, subtitleWeb, redirectionUrl, redirectionType } = validatedOptions

  const isStoreRedirection = redirectionType === RemoteBannerRedirectionType.STORE
  const isExternalRedirection = redirectionType === RemoteBannerRedirectionType.EXTERNAL
  const isExternalAndDefined = isExternalRedirection && redirectionUrl

  const storeAccessibilityLabel = isStoreRedirection ? `Nouvelle fenêtre\u00a0: ${STORE_LINK}` : ''
  const accessibilityLabel = isExternalAndDefined
    ? `Nouvelle fenêtre\u00a0: ${String(redirectionUrl)}`
    : storeAccessibilityLabel

  const onPress = () => {
    if (isStoreRedirection) onPressStoreLink()
    if (isExternalAndDefined) openUrl(redirectionUrl)
  }

  return (
    <BannerWithBackground
      disabled={!isStoreRedirection && !redirectionUrl}
      leftIcon={ArrowAgain}
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
