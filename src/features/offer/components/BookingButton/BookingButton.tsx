import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BottomBanner } from 'features/offer/components/BottomBanner/BottomBanner'
import { CTAButton } from 'features/offer/components/CTAButton/CTAButton'
import { ICTAWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { getSpacing } from 'ui/theme'

type Props = {
  ctaWordingAndAction: ICTAWordingAndAction
  isFreeDigitalOffer?: boolean
  isLoggedIn?: boolean
}

export const BookingButton: FunctionComponent<Props> = ({
  ctaWordingAndAction,
  isFreeDigitalOffer,
  isLoggedIn,
}) => {
  const { wording, onPress, navigateTo, externalNav, isDisabled, bottomBannerText } =
    ctaWordingAndAction

  if (!wording) {
    return null
  }

  return (
    <React.Fragment>
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

      {bottomBannerText ? <BottomBanner text={bottomBannerText} /> : null}
    </React.Fragment>
  )
}

const CallToActionContainer = styled.View({
  marginBottom: getSpacing(8),
})
