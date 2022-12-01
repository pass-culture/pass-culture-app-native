import { useAuthContext } from 'features/auth/AuthContext'
import { isEmailValid } from 'ui/components/inputs/emailCheck'

export const useIsCurrentUserEmail = (email: string): boolean => {
  const { user } = useAuthContext()
  return email.toLowerCase() === user?.email?.toLowerCase()
}

export function useValidateEmail(email: string): useValidateEmailReturn {
  const isCurrentUserEmail = useIsCurrentUserEmail(email)

  if (email.length === 0) return { emailErrorMessage: null, isEmailValid: false }
  if (!isEmailValid(email))
    return {
      emailErrorMessage:
        'L’e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr',
      isEmailValid: false,
    }
  if (isCurrentUserEmail)
    return {
      emailErrorMessage: 'L’e-mail saisi est identique à ton e-mail actuel',
      isEmailValid: false,
    }
  return { emailErrorMessage: null, isEmailValid: true }
}

type useValidateEmailReturn = { emailErrorMessage: string | null; isEmailValid: boolean }
