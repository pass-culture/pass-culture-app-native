import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { STORE_LINK } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { openUrl } from 'features/navigation/helpers/openUrl'
import {
  RemoteBannerOrigin,
  RemoteBannerRedirectionType,
  RemoteBannerType,
  validateRemoteBanner,
} from 'features/remoteBanners/utils/remoteBannerSchema'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { Hourglass } from 'ui/svg/icons/Hourglass'
import { TypoDS } from 'ui/theme'

const isWeb = Platform.OS === 'web'

type RemoteBannerProps = {
  from: RemoteBannerOrigin
  options?: Record<string, unknown>
  logClickEvent: (from: RemoteBannerOrigin, options: RemoteBannerType) => void
}

export const RemoteBanner = ({ from, options, logClickEvent }: RemoteBannerProps) => {
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
    logClickEvent(from, validatedOptions)
    if (isStoreRedirection) onPressStoreLink()
    if (isExternalAndDefined) openUrl(redirectionUrl)
  }

  return (
    <BannerWithBackground
      accessibilityRole={accessibilityRole}
      disabled={!isStoreRedirection && !redirectionUrl}
      leftIcon={Hourglass}
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
