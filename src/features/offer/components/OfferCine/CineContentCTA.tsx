import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { ButtonWithLinearGradientDeprecated } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradientDeprecated'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { getSpacing } from 'ui/theme'

export const CineContentCTAID = 'cine-content-cta'

export const CineContentCTA: FC = () => {
  const { onPress, wording } = useOfferCTA()
  return (
    <StickyBottomWrapper>
      <CallToActionContainer testID={CineContentCTAID}>
        <ButtonWithLinearGradientDeprecated wording={wording} onPress={onPress} />
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
  marginBottom: getSpacing(6),
}))
