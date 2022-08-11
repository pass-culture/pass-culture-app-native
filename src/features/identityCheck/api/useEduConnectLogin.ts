import { useCallback, useEffect, useState } from 'react'

import { eduConnectClient } from 'libs/eduConnectClient'

export function useEduConnectLogin() {
  const [loginUrl, setLoginUrl] = useState<string>()
  const [error, setError] = useState<Error | null>(null)

  const getLoginUrl = useCallback(async () => {
    try {
      const accessToken = await eduConnectClient.getAccessToken()

      const response = await fetch(`${eduConnectClient.getLoginUrl()}?redirect=false`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        mode: 'cors',
        credentials: 'include',
      })

      if (response.ok) {
        const finalURL = response.headers.get('educonnect-redirect')
        if (finalURL) {
          setLoginUrl(finalURL)
          return
        }
      }
      setError(new Error('Failed to get EduConnect login url'))
    } catch (err) {
      setError(err as Error | null)
    }
  }, [])

  useEffect(() => {
    getLoginUrl().catch(setError)
  }, [getLoginUrl])

  const openEduConnect = useCallback(async () => {
    globalThis.window.open(loginUrl, '_blank')
    await getLoginUrl()
  }, [getLoginUrl, loginUrl])

  return { openEduConnect, loginUrl, error }
}
