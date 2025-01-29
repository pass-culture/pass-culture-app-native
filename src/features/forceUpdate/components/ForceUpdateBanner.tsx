import React from 'react'
import styled from 'styled-components/native'

import { TITLE, BUTTON_TEXT_BANNER } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { useBanner } from 'features/forceUpdate/helpers/useBanner'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { TypoDS } from 'ui/theme'

export const ForceUpdateBanner = () => {
  const { title, subtitle, redirectionUrl } = useBanner()
  return (
    <BannerWithBackground leftIcon={ArrowAgain} onPress={redirectionUrl ?? onPressStoreLink}>
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
