import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useHomeBanner } from 'features/home/api/useHomeBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { getSpacing } from 'ui/theme'

type HomeBannerProps = {
  hasGeolocPosition: boolean
  isLoggedIn: boolean
}

export const HomeBanner = ({ hasGeolocPosition, isLoggedIn }: HomeBannerProps) => {
  const { data } = useHomeBanner(hasGeolocPosition)
  const homeBanner = data?.banner
  const Banner = useMemo(() => {
    if (!isLoggedIn)
      return (
        <BannerContainer>
          <SignupBanner />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.activation_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BicolorUnlock}
            from={StepperOrigin.HOME}
          />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.retry_identity_check_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={ArrowAgain}
            from={StepperOrigin.HOME}
          />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.transition_17_18_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BirthdayCake}
            from={StepperOrigin.HOME}
          />
        </BannerContainer>
      )

    return null
  }, [isLoggedIn, homeBanner])
  return Banner
}
const BannerContainer = styled.View({
  marginBottom: getSpacing(8),
})
