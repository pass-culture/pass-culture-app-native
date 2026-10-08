import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { ValidateEmailRequest, ValidateEmailResponse } from 'api/gen'
import { useLoginAndRedirect } from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { useValidateEmailMutation } from 'features/auth/queries/useValidateEmailMutation'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { isTimestampExpired } from 'libs/dates'
import { deviceInfoStoreSelectors } from 'shared/store/deviceInfoStore'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { LoadingPage } from 'ui/pages/LoadingPage'

const validationPromises = new Map<string, Promise<ValidateEmailResponse>>()

export const clearEmailValidationCache = () => validationPromises.clear()

type ValidateEmail = (body: ValidateEmailRequest) => Promise<ValidateEmailResponse>

const validateEmailOnce = ({
  emailValidationToken,
  deviceInfo,
  validateEmail,
  onSuccess,
  onError,
}: ValidateEmailRequest & {
  validateEmail: ValidateEmail
  onSuccess: (response: ValidateEmailResponse) => void | Promise<void>
  onError: (error: unknown) => void
}) => {
  let validationPromise = validationPromises.get(emailValidationToken)

  if (!validationPromise) {
    validationPromise = validateEmail({ emailValidationToken, deviceInfo })
    validationPromises.set(emailValidationToken, validationPromise)
  }

  return validationPromise
    .then((response) => {
      return onSuccess(response)
    })
    .catch((error) => {
      validationPromises.delete(emailValidationToken)
      onError(error)
    })
}

export function AfterSignupEmailValidationBuffer() {
  const loginAndRedirect = useLoginAndRedirect()
  const { params } = useRoute<UseRouteType<'AfterSignupEmailValidationBuffer'>>()
  const deviceInfo = deviceInfoStoreSelectors.selectDeviceInfo()
  const token = params.token
  const email = params.email
  const expirationTimestamp = params.expiration_timestamp

  const { mutateAsync: validateEmailAsync } = useValidateEmailMutation(
    () => {},
    () => {}
  )

  useEffect(
    function validateEmail() {
      const deviceId = deviceInfo.deviceId

      if (!token || !deviceId || !email || !expirationTimestamp) {
        return
      }

      if (isTimestampExpired(expirationTimestamp)) {
        navigateFromRef('SignupConfirmationExpiredLink', { email })
        return
      }

      void validateEmailOnce({
        emailValidationToken: token,
        deviceInfo,
        validateEmail: validateEmailAsync,
        onSuccess: loginAndRedirect,
        onError: () => {
          showErrorSnackBar('Ce lien de validation n’est plus valide')
          navigateFromRef(...homeNavigationConfig)
        },
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, email, expirationTimestamp, deviceInfo.deviceId]
  )

  return <LoadingPage />
}
