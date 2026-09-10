import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { api } from 'api/api'
import { AccountState, EligibilityType } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { LoginRoutineMethod, LoginType } from 'libs/analytics/logEventAnalytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useLoginAndRedirect = () => {
  const disableActivation = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)
  const { replace } = useNavigation<UseNavigationType>()

  const loginRoutine = useLoginRoutine()

  return useCallback(
    async (
      props: { accessToken: string; refreshToken: string },
      options?: { method?: LoginRoutineMethod; analyticsType?: LoginType }
    ) => {
      await loginRoutine(
        { ...props, accountState: AccountState.ACTIVE },
        options?.method ?? 'fromSignup',
        options?.analyticsType ?? 'email_signup'
      )

      try {
        const user = await api.getNativeV1Me()

        if (disableActivation) {
          replace(...getSubscriptionHookConfig('DisableActivation'))
          return
        }

        if (
          user.isEligibleForBeneficiaryUpgrade &&
          user.eligibility === EligibilityType['age-17-18']
        ) {
          replace('VerifyEligibility')
          return
        }

        if (
          user.eligibilityStartDatetime &&
          new Date(user.eligibilityStartDatetime) >= new Date()
        ) {
          replace('NotYetUnderageEligibility', {
            eligibilityStartDatetime: user.eligibilityStartDatetime.toString(),
          })
          return
        }
        replace('AccountCreated')
      } catch {
        replace('AccountCreated')
      }
    },
    [replace, disableActivation, loginRoutine]
  )
}
