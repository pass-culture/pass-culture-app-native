import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { api } from 'api/api'
import { AccountState, EligibilityType } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { SSOType } from 'libs/analytics/logEventAnalytics'
import { CampaignEvents, campaignTracker } from 'libs/campaign'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getAge } from 'shared/user/getAge'

export const useLoginAndRedirect = () => {
  const disableActivation = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)
  const { replace } = useNavigation<UseNavigationType>()
  const delayedReplace: typeof replace = useCallback(
    (...args) => {
      setTimeout(() => replace(...args), 2000)
    },
    [replace]
  )

  const loginRoutine = useLoginRoutine()

  return useCallback(
    async (props: { accessToken: string; refreshToken: string }, analyticsType?: SSOType) => {
      await loginRoutine(
        { ...props, accountState: AccountState.ACTIVE },
        'fromSignup',
        analyticsType
      )

      try {
        const user = await api.getNativeV1Me()
        const userAge = getAge(user.birthDate)
        const firebasePseudoId = await firebaseAnalytics.getAppInstanceId()
        await campaignTracker.logEvent(CampaignEvents.COMPLETE_REGISTRATION, {
          af_firebase_pseudo_id: firebasePseudoId,
          af_user_id: user.id,
        })

        if (userAge && userAge < 18) {
          await campaignTracker.logEvent(CampaignEvents.UNDERAGE_USER, {
            af_firebase_pseudo_id: firebasePseudoId,
            af_user_id: user.id,
            af_user_age: userAge,
          })
        }

        if (disableActivation) {
          delayedReplace(...getSubscriptionHookConfig('DisableActivation'))
          return
        }

        if (
          user.isEligibleForBeneficiaryUpgrade &&
          user.eligibility === EligibilityType['age-17-18']
        ) {
          delayedReplace('VerifyEligibility')
          return
        }

        if (
          user.eligibilityStartDatetime &&
          new Date(user.eligibilityStartDatetime) >= new Date()
        ) {
          delayedReplace('NotYetUnderageEligibility', {
            eligibilityStartDatetime: user.eligibilityStartDatetime.toString(),
          })
          return
        }
        delayedReplace('AccountCreated')
      } catch {
        delayedReplace('AccountCreated')
      }
    },
    [delayedReplace, disableActivation, loginRoutine]
  )
}
