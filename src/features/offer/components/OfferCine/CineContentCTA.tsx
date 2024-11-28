import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { Spacer } from 'ui/theme'

export const CineContentCTA: FC = () => {
  const { onPress, wording } = useOfferCTA()

  return (
    <StickyBottomWrapper>
      <CallToActionContainer>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonWithLinearGradient wording={wording} onPress={onPress} />
        <Spacer.Column numberOfSpaces={6} />
      </CallToActionContainer>
    </StickyBottomWrapper>
  )
}

const CallToActionContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  width: '100%',
  ...(!theme.isMobileViewport && {
    maxWidth: theme.contentPage.maxWidth,
  }),
}))
