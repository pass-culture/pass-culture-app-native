import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { shouldUseSimplifiedActivation18 } from 'features/identityCheck/helpers/shouldUseSimplifiedActivation18'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import {
  StepperOrigin,
  UseNavigationType,
} from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { ActivationBannerDefault } from 'features/profile/components/Banners/ActivationBanner/ActivationBannerDefault'
import { ActivationBannerPending } from 'features/profile/components/Banners/ActivationBanner/ActivationBannerPending'
import { ActivationBannerWithSubscriptionMessage } from 'features/profile/components/Banners/ActivationBanner/ActivationBannerWithSubscriptionMessage'
import {
  BannerType,
  getBannerActivationType,
} from 'features/profile/helpers/getBannerActivationType'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { ActivationDisabledBanner } from 'features/remoteBanners/banners/ActivationDisabledBanner'
import { useFeatureFlagOptionsQuery } from 'libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const ActivationBanner = ({ featureFlags }: ProfileFeatureFlagsProps) => {
  const isMailAppAvailable = useIsMailAppAvailable()
  const { banner: activationBanner } = useActivationBanner()
  const { data: subscriptionInfos } = useGetStepperInfoQuery()
  const { options } = useFeatureFlagOptionsQuery(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)
  const enableSimplifiedActivation18 = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_SIMPLIFIED_ACTIVATION_18
  )
  const { user } = useAuthContext()
  const banner = getBannerActivationType({
    featureFlags,
    activationBanner,
    activationBannerSubscriptionInfos: subscriptionInfos,
    activationDisabledBannerInfos: options,
  })

  const { navigate } = useNavigation<UseNavigationType>()
  const shouldNavigateToUnlockEighteenBirthday = shouldUseSimplifiedActivation18({
    enableSimplifiedActivation18,
    user,
    underageOkIdentityCheckMethod: subscriptionInfos?.underageOkIdentityCheckMethod,
  })

  const onPressSystemBanner = () => {
    if (shouldNavigateToUnlockEighteenBirthday) {
      navigate('EighteenBirthday')
    } else {
      navigate(...getSubscriptionHookConfig('Stepper', { from: StepperOrigin.HOME }))
    }
  }

  switch (banner) {
    case BannerType.ACTIVATION_DISABLED:
      return <ActivationDisabledBanner remoteActivationBannerOptions={options} />

    case BannerType.ACTIVATION_RETRY:
    case BannerType.ACTIVATION_WITH_SUBSCRIPTION_MESSAGE:
      return (
        <ActivationBannerWithSubscriptionMessage
          subscriptionInfos={subscriptionInfos}
          isMailAppAvailable={isMailAppAvailable}
        />
      )

    case BannerType.ACTIVATION_PENDING:
      return <ActivationBannerPending />

    case BannerType.ACTIVATION_DEFAULT:
    default:
      return <ActivationBannerDefault banner={activationBanner} onPress={onPressSystemBanner} />
  }
}
