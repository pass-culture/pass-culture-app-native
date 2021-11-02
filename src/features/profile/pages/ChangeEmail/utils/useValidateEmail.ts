import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'

import { useUserProfileInfo } from 'features/home/api'
import { isEmailValid } from 'ui/components/inputs/emailCheck'

export const useIsCurrentUserEmail = (email: string): boolean => {
  const { data: user } = useUserProfileInfo()
  return email === user?.email
}

export function useValidateEmail(email: string) {
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null)
  const isCurrentUserEmail = useIsCurrentUserEmail(email)

  function checkValidateEmail() {
    if (email.length > 0) {
      if (!isEmailValid(email)) {
        setEmailErrorMessage(t`Format de l'e-mail incorrect`)
      } else if (isCurrentUserEmail) {
        setEmailErrorMessage(t`L'e-mail saisi est identique à votre e-mail actuel`)
      } else {
        setEmailErrorMessage(null)
      }
    } else {
      setEmailErrorMessage(null)
    }
  }

  useEffect(() => {
    checkValidateEmail()
  }, [email])

  return emailErrorMessage
}
