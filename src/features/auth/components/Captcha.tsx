import React from 'react'

import { captureMonitoringError } from 'libs/monitoring/errors'
import { ReCaptchaError, ReCaptchaInternalError } from 'libs/recaptcha/errors'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'

type RecaptchaProps = {
  setIsDoingCaptchaChallenge: (isDoingReCaptchaChallenge: boolean) => void
  setErrorMessage: (errorMessage: string | null) => void
  onRecaptchaSuccess: (token: string) => void
  isDoingCaptchaChallenge: boolean
  isRecaptchaEnabled: boolean
}

export const Captcha = ({
  setIsDoingCaptchaChallenge,
  setErrorMessage,
  onRecaptchaSuccess,
  isDoingCaptchaChallenge,
  isRecaptchaEnabled,
}: RecaptchaProps) => {
  const onReCaptchaClose = () => {
    setIsDoingCaptchaChallenge(false)
  }

  const onReCaptchaError = (errorCode: ReCaptchaError, error?: string | undefined) => {
    setIsDoingCaptchaChallenge(false)
    if (errorCode === ReCaptchaInternalError.NetworkError) {
      setErrorMessage('Un problème est survenu, vérifie ta connexion internet avant de rééssayer.')
    } else {
      setErrorMessage('Un problème est survenu, réessaie plus tard.')
      captureMonitoringError(`${errorCode} ${error ?? 'EMPTY_ERROR'}`, 'LoginOnRecaptchaError')
    }
  }

  const onReCaptchaExpire = () => {
    setIsDoingCaptchaChallenge(false)
    setErrorMessage('Le token reCAPTCHA a expiré, tu peux réessayer.')
  }

  const handleOnReCaptchaSuccess = (token: string) => {
    setIsDoingCaptchaChallenge(false)
    onRecaptchaSuccess(token)
  }

  return isRecaptchaEnabled ? (
    <ReCaptcha
      onClose={onReCaptchaClose}
      onError={onReCaptchaError}
      onExpire={onReCaptchaExpire}
      onSuccess={handleOnReCaptchaSuccess}
      isVisible={isDoingCaptchaChallenge}
    />
  ) : null
}
