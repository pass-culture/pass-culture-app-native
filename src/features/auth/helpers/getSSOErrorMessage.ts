import { SignInResponseFailure } from 'features/auth/types'

type SSOErrorContext = 'signup' | 'login'

type GetSSOErrorMessageParams = {
  provider: 'google' | 'apple' | undefined
  context: SSOErrorContext
}

export const getSSOErrorMessage = ({ provider, context }: GetSSOErrorMessageParams): string => {
  const providerName = provider === 'apple' ? 'Apple' : 'Google'
  const action = context === 'signup' ? 'L’inscription avec ce' : 'La connexion avec ton'
  return `${action} compte ${providerName} est refusée. Contacte le support pour plus d\u2019informations depuis le Profil.`
}

type GetSnackbarSSOErrorMessageProps = { response: SignInResponseFailure; context: SSOErrorContext }

export const getSnackbarSSOErrorMessage = ({
  response,
  context,
}: GetSnackbarSSOErrorMessageProps) => {
  const failureCode = response.content?.code
  const tooManyRequestStatusCode = response.statusCode === 429
  const tooManyAttemptsErrorCodes = failureCode === 'TOO_MANY_ATTEMPTS'

  if (tooManyRequestStatusCode || tooManyAttemptsErrorCodes) {
    return 'Nombre de tentatives dépassé. Réessaye dans 1 minute.'
  }

  if (failureCode === 'NETWORK_REQUEST_FAILED') {
    return 'Erreur réseau. Tu peux réessayer une fois la connexion réétablie.'
  }

  if (failureCode === 'SSO_ERROR') {
    return getSSOErrorMessage({ provider: response.provider, context })
  }

  return 'Erreur lors de la tentative de connexion'
}
