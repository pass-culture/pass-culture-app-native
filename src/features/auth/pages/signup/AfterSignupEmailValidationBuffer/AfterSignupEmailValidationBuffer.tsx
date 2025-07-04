import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef } from 'react'

import { ValidateEmailResponse } from 'api/gen'
import { useLoginAndRedirect } from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { useValidateEmailMutation } from 'features/auth/queries/useValidateEmailMutation'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { analytics } from 'libs/analytics/provider'
import { isTimestampExpired } from 'libs/dates'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { LoadingPage } from 'ui/pages/LoadingPage'

export function AfterSignupEmailValidationBuffer() {
  const { showInfoSnackBar } = useSnackBarContext()
  const deviceInfo = useDeviceInfo()
  const { replace } = useNavigation<UseNavigationType>()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const delayedReplace: typeof replace = (...args) => {
    timeoutRef.current = setTimeout(() => {
      replace(...args)
    }, 2000)
  }
  const loginAndRedirect = useLoginAndRedirect()

  const { params } = useRoute<UseRouteType<'AfterSignupEmailValidationBuffer'>>()

  useEffect(() => {
    if (
      !params?.token ||
      !deviceInfo?.deviceId ||
      !params?.email ||
      !params?.expiration_timestamp
    ) {
      return
    }

    beforeEmailValidation()

    return () => {
      clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceInfo?.deviceId])

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
