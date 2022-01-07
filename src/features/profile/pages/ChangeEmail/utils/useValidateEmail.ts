import { t } from '@lingui/macro'

import { useUserProfileInfo } from 'features/home/api'
import { isEmailValid } from 'ui/components/inputs/emailCheck'

export const useIsCurrentUserEmail = (email: string): boolean => {
  const { data: user } = useUserProfileInfo()
  return email.toLowerCase() === user?.email?.toLowerCase()
}

export function useValidateEmail(email: string): string | null {
  const isCurrentUserEmail = useIsCurrentUserEmail(email)

  if (email.length === 0) return null
  if (!isEmailValid(email))
    return t`L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr`
  if (isCurrentUserEmail) return t`L'e-mail saisi est identique à votre e-mail actuel`
  return null
}
