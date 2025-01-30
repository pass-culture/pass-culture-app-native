import React from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { TITLE, BUTTON_TEXT_BANNER } from 'features/remoteBanner/constants'
import { onPressStoreLink } from 'features/remoteBanner/helpers/onPressStoreLink'
import { useRemoteBanner } from 'features/remoteBanner/helpers/useRemoteBanner'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { RemoteStoreBannerRedirectionType } from 'libs/firebase/firestore/types'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { TypoDS } from 'ui/theme'

export const RemoteBanner = () => {
  const { title, subtitle, redirectionUrl, redirectionType } = useRemoteBanner()
  const accessibilityLabel =
    redirectionUrl && redirectionType === RemoteStoreBannerRedirectionType.EXTERNAL
      ? `Nouvelle fenêtre\u00a0: ${String(redirectionUrl)}`
      : ''
  const onPress = () => {
    if (redirectionType === RemoteStoreBannerRedirectionType.STORE) onPressStoreLink()
    openUrl(redirectionUrl)
  }
  return (
    <BannerWithBackground
      leftIcon={ArrowAgain}
      onPress={onPress}
      {...accessibilityAndTestId(accessibilityLabel)}>
      <StyledButtonText>{title ?? TITLE}</StyledButtonText>
      <StyledBodyText>{subtitle ?? BUTTON_TEXT_BANNER}</StyledBodyText>
    </BannerWithBackground>
  )
}

const StyledButtonText = styled(TypoDS.Button)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
