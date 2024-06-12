import { useNavigation } from '@react-navigation/native'
import React, { ComponentType, FunctionComponent, useCallback, useMemo } from 'react'
import styled from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useHomeBanner } from 'features/home/api/useHomeBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SystemBanner as GenericSystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type HomeBannerProps = {
  hasGeolocPosition: boolean
  isLoggedIn: boolean
  homeId: string
}

const StyledBicolorUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const StyledArrowAgain = styled(ArrowAgain).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const StyledBirthdayCake = styled(BirthdayCake).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const systemBannerIcons: { [key in Exclude<BannerName, 'geolocation_banner'>]: ComponentType } = {
  [BannerName.activation_banner]: StyledBicolorUnlock,
  [BannerName.retry_identity_check_banner]: StyledArrowAgain,
  [BannerName.transition_17_18_banner]: StyledBirthdayCake,
}

const bannerIcons: {
  [key in Exclude<BannerName, 'geolocation_banner'>]: FunctionComponent<AccessibleIcon>
} = {
  [BannerName.activation_banner]: BicolorUnlock,
  [BannerName.retry_identity_check_banner]: ArrowAgain,
  [BannerName.transition_17_18_banner]: BirthdayCake,
}

const bannersToRender = [
  BannerName.activation_banner,
  BannerName.retry_identity_check_banner,
  BannerName.transition_17_18_banner,
]

export const HomeBanner = ({ hasGeolocPosition, isLoggedIn, homeId }: HomeBannerProps) => {
  const { data } = useHomeBanner(hasGeolocPosition)
  const { navigate } = useNavigation<UseNavigationType>()
  const enableSystemBanner = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK)
  const hasGraphicRedesign = useHasGraphicRedesign({
    isFeatureFlagActive: enableSystemBanner,
    homeId,
  })

  const homeBanner = data?.banner
  const shouldRenderSystemBanner = homeBanner ? bannersToRender.includes(homeBanner.name) : false

  const onPressSystemBanner = useCallback(
    (from: StepperOrigin) => {
      navigate('Stepper', { from })
    },
    [navigate]
  )

  const renderBanner = useCallback(
    (Icon: FunctionComponent<AccessibleIcon>, title: string, subtitle: string) => (
      <BannerContainer>
        <ActivationBanner title={title} subtitle={subtitle} icon={Icon} from={StepperOrigin.HOME} />
      </BannerContainer>
    ),
    []
  )

  const Banner = useMemo(() => {
    if (!isLoggedIn)
      return (
        <BannerContainer>
          <SignupBanner hasGraphicRedesign={hasGraphicRedesign} />
        </BannerContainer>
      )

    if (
      shouldRenderSystemBanner &&
      homeBanner?.name &&
      homeBanner.name !== BannerName.geolocation_banner
    ) {
      return renderBanner(bannerIcons[homeBanner.name], homeBanner.title, homeBanner.text)
    }

    return null
  }, [isLoggedIn, homeBanner, shouldRenderSystemBanner, renderBanner, hasGraphicRedesign])

  const renderSystemBanner = useCallback(
    (Icon: ComponentType, title: string, subtitle: string) => (
      <BannerContainer>
        <GenericSystemBanner
          LeftIcon={<Icon />}
          title={title}
          subtitle={subtitle}
          onPress={() => onPressSystemBanner(StepperOrigin.HOME)}
          accessibilityLabel={subtitle}
        />
      </BannerContainer>
    ),
    [onPressSystemBanner]
  )

  const SystemBanner = useMemo(() => {
    if (!isLoggedIn)
      return (
        <BannerContainer>
          <SignupBanner hasGraphicRedesign={hasGraphicRedesign} />
        </BannerContainer>
      )

    if (
      shouldRenderSystemBanner &&
      homeBanner?.name &&
      homeBanner.name !== BannerName.geolocation_banner
    ) {
      return renderSystemBanner(
        systemBannerIcons[homeBanner.name],
        homeBanner.title,
        homeBanner.text
      )
    }

    return null
  }, [isLoggedIn, shouldRenderSystemBanner, renderSystemBanner, homeBanner, hasGraphicRedesign])

  return hasGraphicRedesign ? SystemBanner : Banner
}
const BannerContainer = styled.View({
  marginBottom: getSpacing(8),
})
