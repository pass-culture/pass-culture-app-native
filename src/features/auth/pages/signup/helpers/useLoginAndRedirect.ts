import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { api } from 'api/api'
import { AccountState, EligibilityType } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents } from 'libs/adjust/adjustEvents'
import { SSOType } from 'libs/analytics/logEventAnalytics'
// eslint-disable-next-line no-restricted-imports
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
        Adjust.logEvent(AdjustEvents.REGISTRATION)

        if (userAge && userAge < 18) {
          Adjust.logEvent(AdjustEvents.UNDERAGE_REGISTRATION)
        }

        if (userAge && userAge >= 18) {
          Adjust.logEvent(AdjustEvents.REGISTRATION_18)
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
