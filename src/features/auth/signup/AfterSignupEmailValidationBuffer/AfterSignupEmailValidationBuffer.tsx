import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { api } from 'api/api'
import { AccountState, ValidateEmailResponse } from 'api/gen'
import { useValidateEmailMutation } from 'features/auth/api/useValidateEmailMutation'
import { useLoginRoutine } from 'features/auth/login/useLoginRoutine'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { isTimestampExpired } from 'libs/dates'
import { LoadingPage } from 'ui/components/LoadingPage'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function AfterSignupEmailValidationBuffer() {
  const { showInfoSnackBar } = useSnackBarContext()

  const { replace } = useNavigation<UseNavigationType>()
  const delayedReplace: typeof replace = (...args: Parameters<typeof replace>) => {
    setTimeout(() => {
      replace(...args)
    }, 2000)
  }

  const { params } = useRoute<UseRouteType<'AfterSignupEmailValidationBuffer'>>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(beforeEmailValidation, [])

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
    })
  }

  async function onEmailValidationSuccess({ accessToken, refreshToken }: ValidateEmailResponse) {
    await loginRoutine(
      { accessToken, refreshToken, accountState: AccountState.ACTIVE },
      'fromSignup'
    )

    try {
      const user = await api.getnativev1me()

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
    showInfoSnackBar({ message: 'Ce lien de validation n’est plus valide' })
    delayedReplace(...homeNavConfig)
  }

  return <LoadingPage />
}
