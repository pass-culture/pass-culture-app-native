import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { api } from 'api/api'
import { AccountState, ValidateEmailResponse } from 'api/gen'
import { useValidateEmailMutation } from 'features/auth/api/useValidateEmailMutation'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { analytics } from 'libs/analytics'
import { CampaignEvents, campaignTracker } from 'libs/campaign'
import { isTimestampExpired } from 'libs/dates'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LoadingPage } from 'ui/components/LoadingPage'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function AfterSignupEmailValidationBuffer() {
  const { showInfoSnackBar } = useSnackBarContext()
  const enableTrustedDevice = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_TRUSTED_DEVICE)
  const deviceInfo = useDeviceInfo()
  const { replace } = useNavigation<UseNavigationType>()
  const delayedReplace: typeof replace = (...args) => {
    setTimeout(() => {
      replace(...args)
    }, 2000)
  }

  const { params } = useRoute<UseRouteType<'AfterSignupEmailValidationBuffer'>>()

  useEffect(() => {
    // Wait for feature flag state to be fetched from Firestore
    if (enableTrustedDevice === undefined) return
    // Wait for device info when feature flag is active
    if (enableTrustedDevice && !deviceInfo) return

    beforeEmailValidation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableTrustedDevice, enableTrustedDevice && !deviceInfo])

  const loginRoutine = useLoginRoutine()

  const { mutate: validateEmail } = useValidateEmailMutation(
    onEmailValidationSuccess,
    onEmailValidationFailure
  )

  function beforeEmailValidation() {
    if (isTimestampExpired(params.expiration_timestamp)) {
      delayedReplace('SignupConfirmationExpiredLink', { email: params.email })
      return
    }

    validateEmail({
      emailValidationToken: params.token,
      deviceInfo: enableTrustedDevice ? deviceInfo : undefined,
    })
  }

  async function onEmailValidationSuccess({ accessToken, refreshToken }: ValidateEmailResponse) {
    await analytics.logEmailValidated()

    await loginRoutine(
      { accessToken, refreshToken, accountState: AccountState.ACTIVE },
      'fromSignup'
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
      if (user.eligibilityStartDatetime && new Date(user.eligibilityStartDatetime) >= new Date()) {
        delayedReplace('NotYetUnderageEligibility', {
          eligibilityStartDatetime: user.eligibilityStartDatetime.toString(),
        })
        return
      }
      delayedReplace('AccountCreated')
    } catch {
      delayedReplace('AccountCreated')
    }
  }

  function onEmailValidationFailure() {
    showInfoSnackBar({
      message: 'Ce lien de validation n’est plus valide',
      timeout: SNACK_BAR_TIME_OUT,
    })
    delayedReplace(...homeNavConfig)
  }

  return <LoadingPage />
}
