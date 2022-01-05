import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { api } from 'api/api'
import { ValidateEmailResponse } from 'api/gen'
import { useLoginRoutine } from 'features/auth/AuthContext'
import { useValidateEmailMutation } from 'features/auth/mutations'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { isTimestampExpired } from 'libs/dates'
import { LoadingPage } from 'ui/components/LoadingPage'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function AfterSignupEmailValidationBuffer() {
  const { showInfoSnackBar } = useSnackBarContext()

  const { navigate } = useNavigation<UseNavigationType>()
  const delayedNavigate: typeof navigate = (...args: Parameters<typeof navigate>) => {
    setTimeout(() => {
      navigate(...args)
    }, 2000)
  }
  const { params } = useRoute<UseRouteType<'AfterSignupEmailValidationBuffer'>>()

  useEffect(beforeEmailValidation, [])

  const loginRoutine = useLoginRoutine()

  const { mutate: validateEmail } = useValidateEmailMutation(
    onEmailValidationSuccess,
    onEmailValidationFailure
  )

  function beforeEmailValidation() {
    if (isTimestampExpired(params.expiration_timestamp)) {
      delayedNavigate('SignupConfirmationExpiredLink', { email: params.email })
      return
    }
    validateEmail({
      emailValidationToken: params.token,
    })
  }

  async function onEmailValidationSuccess({ accessToken, refreshToken }: ValidateEmailResponse) {
    await loginRoutine({ accessToken, refreshToken }, 'fromSignup')

    try {
      const user = await api.getnativev1me()

      if (user.isEligibleForBeneficiaryUpgrade) {
        delayedNavigate('VerifyEligibility')
        return
      }
      if (user.eligibilityStartDatetime && new Date(user.eligibilityStartDatetime) >= new Date()) {
        delayedNavigate('NotYetUnderageEligibility', {
          eligibilityStartDatetime: user.eligibilityStartDatetime.toString(),
        })
        return
      }
      delayedNavigate('AccountCreated')
    } catch {
      delayedNavigate('AccountCreated')
    }
  }

  function onEmailValidationFailure() {
    showInfoSnackBar({ message: t`Ce lien de validation n'est plus valide` })
    delayedNavigate(...homeNavConfig)
  }

  return <LoadingPage />
}
