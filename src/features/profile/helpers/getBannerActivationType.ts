import { BannerName, SubscriptionStepperResponseV2 } from 'api/gen'
import { ActivationBanner } from 'features/home/api/useActivationBanner'
import { ProfileFeatureFlagsProps } from 'features/profile/types'

export enum BannerType {
  ACTIVATION_DISABLED = 'ACTIVATION_DISABLED',
  ACTIVATION_WITH_SUBSCRIPTION_MESSAGE = 'ACTIVATION_WITH_SUBSCRIPTION_MESSAGE',
  ACTIVATION_PENDING = 'ACTIVATION_PENDING',
  ACTIVATION_RETRY = 'ACTIVATION_RETRY',
  ACTIVATION_DEFAULT = 'ACTIVATION_DEFAULT',
}

type GetBannerTypeParams = {
  featureFlags: ProfileFeatureFlagsProps['featureFlags']
  activationBanner?: ActivationBanner
  activationBannerSubscriptionInfos?: SubscriptionStepperResponseV2
  activationDisabledBannerInfos?: unknown
}

export const getBannerActivationType = ({
  featureFlags,
  activationBanner,
  activationBannerSubscriptionInfos,
  activationDisabledBannerInfos,
}: GetBannerTypeParams): BannerType => {
  const activationBannerName = activationBanner?.name

  const bannerActivationV2 = activationBannerName === BannerName.activation_banner
  const bannerActivationV3 = activationBannerName === BannerName.transition_17_18_banner
  const bannerActivationDefault = Boolean(bannerActivationV2 || bannerActivationV3)

  const bannerActivationRetry = Boolean(
    activationBannerName === BannerName.retry_identity_check_banner
  )

  const bannerActivationWithSubscriptionMessage = Boolean(
    activationBannerSubscriptionInfos?.subscriptionMessage
  )

  const bannerActivationPending = Boolean(
    activationBannerSubscriptionInfos?.hasIdentityCheckPending
  )

  const isActivationBannerVisible = Boolean(
    bannerActivationDefault ||
      bannerActivationRetry ||
      bannerActivationWithSubscriptionMessage ||
      bannerActivationPending
  )

  const bannerActivationDisabled = Boolean(
    isActivationBannerVisible && featureFlags.disableActivation && activationDisabledBannerInfos
  )

  switch (true) {
    case bannerActivationDisabled:
      return BannerType.ACTIVATION_DISABLED

    case bannerActivationWithSubscriptionMessage:
      return BannerType.ACTIVATION_WITH_SUBSCRIPTION_MESSAGE

    case bannerActivationPending:
      return BannerType.ACTIVATION_PENDING

    case bannerActivationRetry:
      return BannerType.ACTIVATION_RETRY

    case bannerActivationDefault:
    default:
      return BannerType.ACTIVATION_DEFAULT
  }
}
