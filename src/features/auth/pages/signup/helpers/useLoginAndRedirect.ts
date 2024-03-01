import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { api } from 'api/api'
import { AccountState } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { SSOType } from 'libs/analytics/logEventAnalytics'
import { CampaignEvents, campaignTracker } from 'libs/campaign'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'

export const useLoginAndRedirect = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const delayedReplace: typeof replace = useCallback(
    (...args) => {
      setTimeout(() => {
        replace(...args)
      }, 2000)
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
        const firebasePseudoId = await firebaseAnalytics.getAppInstanceId()
        await campaignTracker.logEvent(CampaignEvents.COMPLETE_REGISTRATION, {
          af_firebase_pseudo_id: firebasePseudoId,
          af_user_id: user.id,
        })

        if (user.isEligibleForBeneficiaryUpgrade) {
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
    [delayedReplace, loginRoutine]
  )
}
