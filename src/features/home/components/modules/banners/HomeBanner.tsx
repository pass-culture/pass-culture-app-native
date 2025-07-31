import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { RemoteActivationBanner } from 'features/remoteBanners/banners/RemoteActivationBanner'
import { RemoteGenericBanner } from 'features/remoteBanners/banners/RemoteGenericBanner'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useFeatureFlagOptions } from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SystemBanner as GenericSystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Unlock } from 'ui/svg/icons/Unlock'

type HomeBannerProps = {
  isLoggedIn: boolean
}

const StyledUnlock = styled(Unlock).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.error,
}))``

const StyledArrowAgain = styled(ArrowAgain).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.error,
}))``

const StyledBirthdayCake = styled(BirthdayCake).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.error,
}))``

const systemBannerIcons: {
  [key in Exclude<BannerName, 'geolocation_banner'>]: React.FunctionComponent<AccessibleIcon>
} = {
  [BannerName.activation_banner]: StyledUnlock,
  [BannerName.retry_identity_check_banner]: StyledArrowAgain,
  [BannerName.transition_17_18_banner]: StyledBirthdayCake,
}

const bannersToRender = [
  BannerName.activation_banner,
  BannerName.retry_identity_check_banner,
  BannerName.transition_17_18_banner,
]

export const HomeBanner = ({ isLoggedIn }: HomeBannerProps) => {
  const showRemoteGenericBanner = useFeatureFlag(RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER)
  const disableActivation = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)
  const { options: remoteGenericBannerOptions } = useFeatureFlagOptions(
    RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER
  )
  const { options: remoteActivationBannerOptions } = useFeatureFlagOptions(
    RemoteStoreFeatureFlags.DISABLE_ACTIVATION
  )

  const { banner } = useActivationBanner()
  const { navigate } = useNavigation<UseNavigationType>()

  const shouldRenderSystemBanner = banner.name ? bannersToRender.includes(banner.name) : false

  const systemBannerAnalyticsType =
    banner.name === BannerName.geolocation_banner ? 'location' : 'credit'

  const onPressSystemBanner = useCallback(
    (from: StepperOrigin) => {
      navigate(...getSubscriptionHookConfig('Stepper', { from }))
    },
    [navigate]
  )

  const renderSystemBanner = useCallback(
    (Icon: React.FunctionComponent<AccessibleIcon>, title: string, subtitle: string) => (
      <BannerContainer>
        <GenericSystemBanner
          leftIcon={Icon}
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
    if (disableActivation && remoteActivationBannerOptions) {
      return (
        <BannerContainer>
          <RemoteActivationBanner
            from="home"
            remoteActivationBannerOptions={remoteActivationBannerOptions}
          />
        </BannerContainer>
      )
    }

    if (!isLoggedIn) {
      return (
        <BannerContainer>
          <SignupBanner />
        </BannerContainer>
      )
    }

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
  }, [
    disableActivation,
    remoteActivationBannerOptions,
    isLoggedIn,
    shouldRenderSystemBanner,
    banner.name,
    banner.title,
    banner.text,
    renderSystemBanner,
  ])

  return (
    <React.Fragment>
      {showRemoteGenericBanner && remoteGenericBannerOptions ? (
        <RemoteGenericBannerContainer>
          <RemoteGenericBanner
            from="home"
            remoteGenericBannerOptions={remoteGenericBannerOptions}
          />
        </RemoteGenericBannerContainer>
      ) : null}
      {SystemBanner}
    </React.Fragment>
  )
}

const BannerContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const RemoteGenericBannerContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))
