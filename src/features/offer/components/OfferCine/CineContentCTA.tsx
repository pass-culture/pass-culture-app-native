import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { Button } from 'ui/designSystem/Button/Button'

export const CineContentCTAID = 'cine-content-cta'

type Props = {
  displayGradient?: boolean
}

export const CineContentCTA: FC<Props> = ({ displayGradient }) => {
  const { onPress, wording } = useOfferCTA()
  return (
    <StickyBottomWrapper displayGradient={displayGradient}>
      <CallToActionContainer testID={CineContentCTAID}>
        <Button wording={wording} onPress={onPress} />
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
  marginBottom: theme.designSystem.size.spacing.xl,
}))
