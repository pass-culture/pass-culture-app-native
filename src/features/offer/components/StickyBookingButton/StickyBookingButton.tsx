import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BottomBanner } from 'features/offer/components/BottomBanner/BottomBanner'
import { CTAButton } from 'features/offer/components/CTAButton/CTAButton'
import { ICTAWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { BlurryWrapper } from 'ui/components/BlurryWrapper/BlurryWrapper'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'
import { Spacer, getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  ctaWordingAndAction: ICTAWordingAndAction
  isFreeDigitalOffer?: boolean
  isLoggedIn?: boolean
  secondaryCtaWordingAndAction?: ICTAWordingAndAction
}

export const StickyBookingButton: FunctionComponent<Props> = ({
  ctaWordingAndAction,
  isFreeDigitalOffer,
  isLoggedIn,
  secondaryCtaWordingAndAction,
}) => {
  const { bottom } = useCustomSafeInsets()
  const { wording, onPress, navigateTo, externalNav, isDisabled, bottomBannerText } =
    ctaWordingAndAction
  const {
    wording: secondaryWording,
    onPress: onPressSecondary,
    navigateTo: secondaryNavigateTo,
    externalNav: secondaryExternalNav,
    isDisabled: secondaryIsDisabled,
  } = secondaryCtaWordingAndAction ?? {}

  if (!wording && !bottomBannerText) {
    return null
  }

  return (
    <StyledStickyBottomWrapper bottom={-bottom}>
      {wording ? (
        <BlurryWrapper>
          <CallToActionContainer testID="sticky-booking-button" accessible>
            <ButtonWrapper>
              <CTAButton
                wording={wording}
                onPress={onPress}
                navigateTo={navigateTo}
                externalNav={externalNav}
                isDisabled={isDisabled}
                isFreeDigitalOffer={isFreeDigitalOffer}
                isLoggedIn={isLoggedIn}
              />
            </ButtonWrapper>
            {secondaryCtaWordingAndAction ? (
              <ButtonWrapper>
                <CTAButton
                  wording={secondaryWording ?? ''}
                  onPress={onPressSecondary}
                  navigateTo={secondaryNavigateTo}
                  externalNav={secondaryExternalNav}
                  isDisabled={secondaryIsDisabled}
                  isFreeDigitalOffer={isFreeDigitalOffer}
                  isLoggedIn={isLoggedIn}
                />
              </ButtonWrapper>
            ) : null}
          </CallToActionContainer>
        </BlurryWrapper>
      ) : null}

      {bottomBannerText ? <StyledBottomBanner text={bottomBannerText} /> : <Spacer.BottomScreen />}
    </StyledStickyBottomWrapper>
  )
}

const StyledStickyBottomWrapper = styled(StickyBottomWrapper)(({ bottom }) => ({ bottom }))

const CallToActionContainer = styled.View({
  paddingHorizontal: getSpacing(4),
  marginTop: getSpacing(4),
  marginBottom: getSpacing(8),
  flexDirection: 'row',
  width: '100%',
})

const StyledBottomBanner = styled(BottomBanner)({
  width: '100%',
})

const ButtonWrapper = styled.View({
  flex: 1,
  marginHorizontal: getSpacing(1),
})
