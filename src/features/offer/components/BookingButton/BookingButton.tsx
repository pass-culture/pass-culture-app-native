import React, { FunctionComponent } from 'react'
import { styled } from 'styled-components/native'

import { BottomBanner } from 'features/offer/components/BottomBanner/BottomBanner'
import { CTAButton } from 'features/offer/components/CTAButton/CTAButton'
import { ICTAWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'

type Props = {
  ctaWordingAndAction: ICTAWordingAndAction
  isFreeDigitalOffer?: boolean
  isLoggedIn?: boolean
  fullScreen?: boolean
}

export const BookingButton: FunctionComponent<Props> = ({
  ctaWordingAndAction,
  isFreeDigitalOffer,
  isLoggedIn,
  fullScreen,
}) => {
  const { wording, onPress, navigateTo, externalNav, isDisabled, bottomBannerText } =
    ctaWordingAndAction

  if (!wording) {
    return null
  }

  return (
    <React.Fragment>
      <ButtonContainer testID="booking-button" fullScreen={fullScreen}>
        <CTAButton
          wording={wording}
          onPress={onPress}
          navigateTo={navigateTo}
          externalNav={externalNav}
          isDisabled={isDisabled}
          isFreeDigitalOffer={isFreeDigitalOffer}
          isLoggedIn={isLoggedIn}
        />
      </ButtonContainer>
      {bottomBannerText ? <BottomBanner text={bottomBannerText} /> : null}
    </React.Fragment>
  )
}

const ButtonContainer = styled.View<{ fullScreen?: boolean }>(({ fullScreen }) => ({
  width: fullScreen ? '100%' : '50%',
}))
