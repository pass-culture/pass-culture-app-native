type SSOErrorContext = 'signup' | 'login'

export const getSSOErrorMessage = (
  provider: 'google' | 'apple' | undefined,
  context: SSOErrorContext
): string => {
  const providerName = provider === 'apple' ? 'Apple' : 'Google'
  const action = context === 'signup' ? 'L\u2019inscription avec ce' : 'La connexion avec ton'
  return `${action} compte ${providerName} est refusée. Contacte le support pour plus d\u2019informations depuis le Profil.`
}
