import React from 'react'
import styled from 'styled-components/native'

import { TITLE, BUTTON_TEXT_BANNER } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { TypoDS } from 'ui/theme'

export const ForceUpdateBanner = () => (
  <BannerWithBackground leftIcon={ArrowAgain} onPress={onPressStoreLink}>
    <StyledButtonText>{TITLE}</StyledButtonText>
    <StyledBodyText>{BUTTON_TEXT_BANNER}</StyledBodyText>
  </BannerWithBackground>
)

const StyledButtonText = styled(TypoDS.Button)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
