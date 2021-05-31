import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { BeneficiaryValidationStep, ValidateEmailResponse } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { homeNavigateConfig } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { useNextBeneficiaryValidationStep } from 'features/profile/api'
import { isTimestampExpired } from 'libs/dates'
import { LoadingPage } from 'ui/components/LoadingPage'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { useLoginRoutine } from '../AuthContext'
import { useValidateEmailMutation } from '../mutations'

export function AfterSignupEmailValidationBuffer() {
  const { data: settings } = useAppSettings()
  const { showInfoSnackBar } = useSnackBarContext()

  const { navigate } = useNavigation<UseNavigationType>()
  const { refetch: getNextBeneficiaryValidationStep } = useNextBeneficiaryValidationStep({
    enabled: false,
  })

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
    if (isTimestampExpired(params.expirationTimestamp)) {
      delayedNavigate('SignupConfirmationExpiredLink', { email: params.email })
      return
    }
    validateEmail({
      emailValidationToken: params.token,
    })
  }

  // TODO: finish this implementation following the schema gaved by Victor (https://passculture.atlassian.net/browse/PC-9026)
  async function hasBeneficiaryNextStepToFollowGuard() {
    try {
      const { data } = await getNextBeneficiaryValidationStep()
      if (data) {
        const nextStep = data.next_beneficiary_validation_step

        if (nextStep === BeneficiaryValidationStep.IdCheck) {
          navigate('IdCheck', {
            //
          })
        } else if (nextStep === BeneficiaryValidationStep.PhoneValidation) {
          navigate('PhoneValidation')
        }
        return true
      }
    } catch (error) {}

    return false
  }

  async function onEmailValidationSuccess(response: ValidateEmailResponse) {
    await loginRoutine(
      { accessToken: response.accessToken, refreshToken: response.refreshToken },
      'fromSignup'
    )

    const hasNextStep = await hasBeneficiaryNextStepToFollowGuard()

    if (hasNextStep) {
      return
    }

    if (!response.idCheckToken || !settings?.allowIdCheckRegistration) {
      delayedNavigate('AccountCreated')
    } else {
      delayedNavigate('VerifyEligibility', {
        email: params.email,
        licence_token: response.idCheckToken,
        expiration_timestamp:
          response.idCheckTokenTimestamp instanceof Date
            ? response.idCheckTokenTimestamp.getTime()
            : response.idCheckTokenTimestamp,
      })
    }
  }

  function onEmailValidationFailure() {
    showInfoSnackBar({
      message: t`Ce lien de validation n'est plus valide`,
    })
    delayedNavigate(homeNavigateConfig.screen, homeNavigateConfig.params)
  }

  return <LoadingPage />
}
