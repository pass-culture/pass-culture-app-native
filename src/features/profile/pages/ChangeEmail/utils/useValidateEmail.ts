import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'

import { isEmailValid, useIsCurrentUserEmail } from 'ui/components/inputs/emailCheck'

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
