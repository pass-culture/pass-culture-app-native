import { useCallback, useEffect, useState } from 'react'

import { captureMonitoringError } from 'libs/monitoring'
import { ReCaptchaError } from 'libs/recaptcha/errors'

export const useSignupRecaptcha = ({
  handleSignup,
  setErrorMessage,
  isUserConnected,
}: {
  handleSignup: (token: string, marketingEmailSubscription: boolean) => void
  setErrorMessage: (error: string | null) => void
  isUserConnected?: boolean | null
}) => {
  const [isDoingReCaptchaChallenge, setIsDoingReCaptchaChallenge] = useState(false)

  useEffect(() => {
    if (isUserConnected) {
      setErrorMessage(null)
    } else {
      setErrorMessage('Hors connexion\u00a0: en attente du réseau.')
      setIsDoingReCaptchaChallenge(false)
    }
  }, [isUserConnected, setErrorMessage])

  const openReCaptchaChallenge = useCallback(() => {
    if (!isUserConnected) {
      return
    }
    setIsDoingReCaptchaChallenge(true)
    setErrorMessage(null)
  }, [isUserConnected, setErrorMessage])

  const onReCaptchaClose = useCallback(() => {
    setIsDoingReCaptchaChallenge(false)
  }, [])

  const onReCaptchaError = useCallback(
    (errorCode: ReCaptchaError, error: string | undefined) => {
      setIsDoingReCaptchaChallenge(false)
      setErrorMessage('Un problème est survenu pendant l’inscription, réessaie plus tard.')
      if (errorCode !== 'ReCaptchaNetworkError') {
        captureMonitoringError(`${errorCode} ${error ?? ''}`, 'AcceptCguOnReCaptchaError')
      }
    },
    [setErrorMessage]
  )

  const onReCaptchaExpire = useCallback(() => {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage('Le token reCAPTCHA a expiré, tu peux réessayer.')
  }, [setErrorMessage])

  const onReCaptchaSuccess = useCallback(
    (token: string, marketingEmailSubscription: boolean) => {
      setIsDoingReCaptchaChallenge(false)
      handleSignup(token, marketingEmailSubscription)
    },
    [handleSignup]
  )
  return {
    openReCaptchaChallenge,
    onReCaptchaClose,
    onReCaptchaError,
    onReCaptchaExpire,
    onReCaptchaSuccess,
    isDoingReCaptchaChallenge,
  }
}
