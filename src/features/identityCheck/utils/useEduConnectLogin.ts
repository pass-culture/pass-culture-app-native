import { useCallback, useEffect, useState } from 'react'

import { EduConnectError } from 'features/identityCheck/errors/eduConnect/types'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/errors/hooks/useNotEligibleEduConnectErrorData'
import { eduConnectClient } from 'libs/eduConnectClient'

export function useEduConnectLogin() {
  const [loginUrl, setLoginUrl] = useState<string>()
  const [error, setError] = useState<EduConnectError | null>(null)

  const getLoginUrl = async () => {
    try {
      const accessToken = await eduConnectClient.getAccessToken()

      const { status, headers } = await fetch(`${eduConnectClient.getLoginUrl()}?redirect=false`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        mode: 'cors',
        credentials: 'include',
      })

      if (status === 204) {
        const finalURL = headers.get('educonnect-redirect')
        if (finalURL) {
          setLoginUrl(finalURL)
          return
        }
      }
      setError(new EduConnectError(EduConnectErrorMessageEnum.GenericError))
    } catch (err) {
      setError(new EduConnectError(EduConnectErrorMessageEnum.GenericError))
    }
  }

  useEffect(() => {
    getLoginUrl().catch(() =>
      setError(new EduConnectError(EduConnectErrorMessageEnum.GenericError))
    )
  }, [eduConnectClient])

  const openEduConnect = useCallback(async () => {
    try {
      globalThis.window.open(loginUrl, '_blank')
      await getLoginUrl()
    } catch (err) {
      setError(new EduConnectError(EduConnectErrorMessageEnum.GenericError))
    }
  }, [eduConnectClient, loginUrl])

  return { openEduConnect, loginUrl, error }
}
