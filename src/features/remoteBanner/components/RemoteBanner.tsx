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
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlagOptions } from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { TypoDS } from 'ui/theme'

const isWeb = Platform.OS === 'web'

export type RemoteBannerOrigin = 'Profile' | 'Home' | 'Cheatcodes'

// Created this "dumb" component for Storybook
export const RemoteBannerDumb: React.FC<{
  showWebAlternative: boolean
  accessibilityLabel: string
  isStoreRedirection: boolean
  onPress: () => void
  redirectionUrl: string | null | undefined
  subtitleMobile: string | null | undefined
  subtitleWeb: string | null | undefined
  title: string
}> = ({
  showWebAlternative,
  accessibilityLabel,
  isStoreRedirection,
  onPress,
  redirectionUrl,
  subtitleMobile,
  subtitleWeb,
  title,
}) => (
  <BannerWithBackground
    disabled={!isStoreRedirection && !redirectionUrl}
    leftIcon={ArrowAgain}
    onPress={onPress}
    {...accessibilityAndTestId(accessibilityLabel)}>
    <StyledButtonText>{title}</StyledButtonText>
    <StyledBodyText>{showWebAlternative ? subtitleWeb : subtitleMobile}</StyledBodyText>
  </BannerWithBackground>
)

export const RemoteBanner = ({ from }: { from: RemoteBannerOrigin }) => {
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
    analytics.logHasClickedRemoteBanner(from, validatedOptions)
    if (isStoreRedirection) onPressStoreLink()
    if (isExternalAndDefined) openUrl(redirectionUrl)
  }

  return (
    <RemoteBannerDumb
      showWebAlternative={isWeb}
      accessibilityLabel={accessibilityLabel}
      isStoreRedirection={isStoreRedirection}
      onPress={onPress}
      redirectionUrl={redirectionUrl}
      subtitleMobile={subtitleMobile}
      subtitleWeb={subtitleWeb}
      title={title}
    />
  )
}

const StyledButtonText = styled(TypoDS.Button)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
