import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { TITLE, BUTTON_TEXT_BANNER, STORE_LINK } from 'features/forceUpdate/constants'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { TypoDS } from 'ui/theme'

async function openStore() {
  await openUrl(STORE_LINK)
}

const onPressStoreLink = Platform.select({
  default: () => {
    void (async () => {
      await openStore()
    })()
  },
  web: () => globalThis?.window?.location?.reload(),
})

export const ForceUpdateBanner = () => {
  return (
    <BannerWithBackground leftIcon={ArrowAgain} onPress={onPressStoreLink}>
      <StyledButtonText>{TITLE}</StyledButtonText>
      <StyledBodyText>{BUTTON_TEXT_BANNER}</StyledBodyText>
    </BannerWithBackground>
  )
}

const StyledButtonText = styled(TypoDS.Button)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBodyText = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
