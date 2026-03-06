import React from 'react'

import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
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
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const ActivationBanner = ({ featureFlags }: ProfileFeatureFlagsProps) => {
  const { banner: activationBanner } = useActivationBanner()
  const { data: subscriptionInfos } = useGetStepperInfoQuery()
  const { options } = useFeatureFlagOptionsQuery(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)
  const banner = getBannerActivationType({
    featureFlags,
    activationBanner,
    activationBannerSubscriptionInfos: subscriptionInfos,
    activationDisabledBannerInfos: options,
  })

  switch (banner) {
    case BannerType.ACTIVATION_DISABLED:
      return <ActivationDisabledBanner remoteActivationBannerOptions={options} />

    case BannerType.ACTIVATION_RETRY:
    case BannerType.ACTIVATION_WITH_SUBSCRIPTION_MESSAGE:
      return <ActivationBannerWithSubscriptionMessage subscriptionInfos={subscriptionInfos} />

    case BannerType.ACTIVATION_PENDING:
      return <ActivationBannerPending />

    case BannerType.ACTIVATION_DEFAULT:
    default:
      return <ActivationBannerDefault banner={activationBanner} />
  }
}
