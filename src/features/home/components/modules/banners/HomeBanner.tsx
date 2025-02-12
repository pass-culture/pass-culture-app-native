import { useNavigation } from '@react-navigation/native'
import React, { ComponentType, FunctionComponent, useCallback, useMemo } from 'react'
import styled from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { RemoteBanner } from 'features/remoteBanner/components/RemoteBanner'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SystemBanner as GenericSystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type HomeBannerProps = {
  isLoggedIn: boolean
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

export const HomeBanner = ({ isLoggedIn }: HomeBannerProps) => {
  const showRemoteBanner = useFeatureFlag(RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER)
  const { banner } = useActivationBanner()
  const { navigate } = useNavigation<UseNavigationType>()
  const enableSystemBanner = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK)

  const shouldRenderSystemBanner = banner.name ? bannersToRender.includes(banner.name) : false

  const systemBannerAnalyticsType =
    banner.name === BannerName.geolocation_banner ? 'location' : 'credit'

  const onPressSystemBanner = useCallback(
    (from: StepperOrigin) => {
      navigate('Stepper', { from })
    },
    [navigate]
  )

  const renderActivationBanner = useCallback(
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
          <SignupBanner hasGraphicRedesign={enableSystemBanner} />
        </BannerContainer>
      )

    if (
      shouldRenderSystemBanner &&
      banner.name &&
      banner.name !== BannerName.geolocation_banner &&
      banner.title &&
      banner.text
    ) {
      return renderActivationBanner(bannerIcons[banner.name], banner.title, banner.text)
    }

    return null
  }, [isLoggedIn, banner, shouldRenderSystemBanner, renderActivationBanner, enableSystemBanner])

  const renderSystemBanner = useCallback(
    (Icon: ComponentType, title: string, subtitle: string) => (
      <BannerContainer>
        <GenericSystemBanner
          LeftIcon={<Icon />}
          title={title}
          subtitle={subtitle}
          onPress={() => onPressSystemBanner(StepperOrigin.HOME)}
          accessibilityLabel={subtitle}
          analyticsParams={{ type: systemBannerAnalyticsType, from: 'home' }}
        />
      </BannerContainer>
    ),
    [systemBannerAnalyticsType, onPressSystemBanner]
  )

  const SystemBanner = useMemo(() => {
    if (!isLoggedIn)
      return (
        <BannerContainer>
          <SignupBanner hasGraphicRedesign={enableSystemBanner} />
        </BannerContainer>
      )

    if (
      shouldRenderSystemBanner &&
      banner.name &&
      banner.name !== BannerName.geolocation_banner &&
      banner.title &&
      banner.text
    ) {
      return renderSystemBanner(systemBannerIcons[banner.name], banner.title, banner.text)
    }

    return null
  }, [isLoggedIn, shouldRenderSystemBanner, renderSystemBanner, banner, enableSystemBanner])

  if (showRemoteBanner) {
    return (
      <BannerContainer>
        <RemoteBanner from="Home" />
      </BannerContainer>
    )
  }

  return enableSystemBanner ? SystemBanner : Banner
}

const BannerContainer = styled.View({
  marginBottom: getSpacing(8),
})
