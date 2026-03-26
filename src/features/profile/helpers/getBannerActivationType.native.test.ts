import { BannerName, SubscriptionStepperResponseV2 } from 'api/gen'
import { ActivationBanner } from 'features/home/api/useActivationBanner'
import {
  BannerType,
  getBannerActivationType,
} from 'features/profile/helpers/getBannerActivationType'

describe('getBannerActivationType', () => {
  const featureFlagsDefault = {
    enablePassForAll: false,
    enableProfileV2: false,
    disableActivation: false,
  }

  const activationBannerDefault: ActivationBanner = {
    name: BannerName.activation_banner,
    title: 'Titre',
    text: 'Texte',
  }

  const activationBannerRetry: ActivationBanner = {
    name: BannerName.retry_identity_check_banner,
    title: 'Titre retry',
    text: 'Texte retry',
  }

  const subscriptionInfosWithMessage: SubscriptionStepperResponseV2 = {
    allowedIdentityCheckMethods: [],
    hasIdentityCheckPending: false,
    subscriptionStepsToDisplay: [],
    subscriptionMessage: { userMessage: 'msg' },
    title: 'Titre',
  }

  const subscriptionInfosPending: SubscriptionStepperResponseV2 = {
    allowedIdentityCheckMethods: [],
    hasIdentityCheckPending: true,
    subscriptionStepsToDisplay: [],
    subscriptionMessage: undefined,
    title: 'Titre',
  }

  const disabledBannerInfos = { msg: 'disabled' }

  it('returns ACTIVATION_DEFAULT for default activation banner', () => {
    const result = getBannerActivationType({
      featureFlags: featureFlagsDefault,
      activationBanner: activationBannerDefault,
    })

    expect(result).toBe(BannerType.ACTIVATION_DEFAULT)
  })

  it('returns ACTIVATION_RETRY when banner is retry', () => {
    const result = getBannerActivationType({
      featureFlags: featureFlagsDefault,
      activationBanner: activationBannerRetry,
    })

    expect(result).toBe(BannerType.ACTIVATION_RETRY)
  })

  it('returns ACTIVATION_WITH_SUBSCRIPTION_MESSAGE when subscription message exists', () => {
    const result = getBannerActivationType({
      featureFlags: featureFlagsDefault,
      activationBanner: activationBannerDefault,
      activationBannerSubscriptionInfos: subscriptionInfosWithMessage,
    })

    expect(result).toBe(BannerType.ACTIVATION_WITH_SUBSCRIPTION_MESSAGE)
  })

  it('returns ACTIVATION_PENDING when identity check pending', () => {
    const result = getBannerActivationType({
      featureFlags: featureFlagsDefault,
      activationBanner: activationBannerDefault,
      activationBannerSubscriptionInfos: subscriptionInfosPending,
    })

    expect(result).toBe(BannerType.ACTIVATION_PENDING)
  })

  it('returns ACTIVATION_DISABLED when disableActivation flag is true and disabledBannerInfos exist', () => {
    const result = getBannerActivationType({
      featureFlags: { ...featureFlagsDefault, disableActivation: true },
      activationBanner: activationBannerDefault,
      activationBannerSubscriptionInfos: subscriptionInfosWithMessage,
      activationDisabledBannerInfos: disabledBannerInfos,
    })

    expect(result).toBe(BannerType.ACTIVATION_DISABLED)
  })
})
