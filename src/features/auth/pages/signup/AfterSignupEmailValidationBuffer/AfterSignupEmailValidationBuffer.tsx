import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { ValidateEmailResponse } from 'api/gen'
import { useValidateEmailMutation } from 'features/auth/api/useValidateEmailMutation'
import { useLoginAndRedirect } from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { analytics } from 'libs/analytics'
import { isTimestampExpired } from 'libs/dates'
import { LoadingPage } from 'ui/components/LoadingPage'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function AfterSignupEmailValidationBuffer() {
  const { showInfoSnackBar } = useSnackBarContext()
  const deviceInfo = useDeviceInfo()
  const { replace } = useNavigation<UseNavigationType>()
  const delayedReplace: typeof replace = (...args) => {
    setTimeout(() => {
      replace(...args)
    }, 2000)
  }
  const loginAndRedirect = useLoginAndRedirect()

  const { params } = useRoute<UseRouteType<'AfterSignupEmailValidationBuffer'>>()

  useEffect(() => {
    if (!deviceInfo) return

    beforeEmailValidation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceInfo])

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
      deviceInfo,
    })
  }

  async function onEmailValidationSuccess(props: ValidateEmailResponse) {
    await analytics.logEmailValidated()
    await loginAndRedirect(props)
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
