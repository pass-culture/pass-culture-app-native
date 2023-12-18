import React from 'react'
import styled from 'styled-components/native'

import { BottomBanner } from 'features/offer/components/BottomBanner/BottomBanner'
import { CTAButton } from 'features/offer/components/CTAButton/CTAButton'
import { ICTAWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { BlurryWrapper } from 'ui/components/BlurryWrapper/BlurryWrapper'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { Spacer, getSpacing } from 'ui/theme'

type OfferBookingButtonProps = {
  ctaWordingAndAction: ICTAWordingAndAction
  isFreeDigitalOffer?: boolean
  isLoggedIn?: boolean
}

export function OfferBookingButton({
  ctaWordingAndAction,
  isFreeDigitalOffer,
  isLoggedIn,
}: OfferBookingButtonProps) {
  const { wording, onPress, navigateTo, externalNav, isDisabled, bottomBannerText } =
    ctaWordingAndAction

  if (!wording) {
    return null
  }

  return (
    <StickyBottomWrapper>
      <BlurryWrapper>
        <CallToActionContainer>
          <CTAButton
            wording={wording}
            onPress={onPress}
            navigateTo={navigateTo}
            externalNav={externalNav}
            isDisabled={isDisabled}
            isFreeDigitalOffer={isFreeDigitalOffer}
            isLoggedIn={isLoggedIn}
          />
        </CallToActionContainer>

        {bottomBannerText ? (
          <StyledBottomBanner text={bottomBannerText} />
        ) : (
          <Spacer.BottomScreen />
        )}
      </BlurryWrapper>
    </StickyBottomWrapper>
  )
}

const CallToActionContainer = styled.View({
  paddingHorizontal: getSpacing(4),
  marginTop: getSpacing(4),
  marginBottom: getSpacing(8),
  width: '100%',
})

const StyledBottomBanner = styled(BottomBanner)({
  width: '100%',
})
