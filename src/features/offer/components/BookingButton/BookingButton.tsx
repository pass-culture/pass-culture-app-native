import React, { FunctionComponent } from 'react'
import { View } from 'react-native'

import { BottomBanner } from 'features/offer/components/BottomBanner/BottomBanner'
import { CTAButton } from 'features/offer/components/CTAButton/CTAButton'
import { ICTAWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'

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
      <View testID="booking-button">
        <CTAButton
          wording={wording}
          onPress={onPress}
          navigateTo={navigateTo}
          externalNav={externalNav}
          isDisabled={isDisabled}
          isFreeDigitalOffer={isFreeDigitalOffer}
          isLoggedIn={isLoggedIn}
        />
      </View>
      {bottomBannerText ? <BottomBanner text={bottomBannerText} /> : null}
    </React.Fragment>
  )
}
