import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useHomeBanner } from 'features/home/api/useHomeBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SystemBanner as GenericSystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
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
  const { navigate } = useNavigation<UseNavigationType>()
  const enableSystemBanner = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK)

  const homeBanner = data?.banner

  const onPressSystemBanner = useCallback(
    (from: StepperOrigin) => {
      navigate('Stepper', { from })
    },
    [navigate]
  )

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

  const SystemBanner = useMemo(() => {
    if (!isLoggedIn)
      return (
        <BannerContainer>
          <SignupBanner />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.activation_banner)
      return (
        <BannerContainer>
          <GenericSystemBanner
            LeftIcon={<StyledBicolorUnlock />}
            title={homeBanner.title}
            subtitle={homeBanner.text}
            onPress={() => onPressSystemBanner(StepperOrigin.HOME)}
            accessibilityLabel={homeBanner.text}
          />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.retry_identity_check_banner)
      return (
        <BannerContainer>
          <GenericSystemBanner
            LeftIcon={<StyledArrowAgain />}
            title={homeBanner.title}
            subtitle={homeBanner.text}
            onPress={() => onPressSystemBanner(StepperOrigin.HOME)}
            accessibilityLabel={homeBanner.text}
          />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.transition_17_18_banner)
      return (
        <BannerContainer>
          <GenericSystemBanner
            LeftIcon={<StyledBirthdayCake />}
            title={homeBanner.title}
            subtitle={homeBanner.text}
            onPress={() => onPressSystemBanner(StepperOrigin.HOME)}
            accessibilityLabel={homeBanner.text}
          />
        </BannerContainer>
      )

    return null
  }, [isLoggedIn, homeBanner, onPressSystemBanner])

  return enableSystemBanner ? SystemBanner : Banner
}
const BannerContainer = styled.View({
  marginBottom: getSpacing(8),
})

const StyledBicolorUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const StyledArrowAgain = styled(ArrowAgain).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const StyledBirthdayCake = styled(BirthdayCake).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``
