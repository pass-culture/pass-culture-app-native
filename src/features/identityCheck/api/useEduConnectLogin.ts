import { useCallback, useState } from 'react'

import { eduConnectClient } from 'libs/eduConnectClient'

export function useEduConnectLogin() {
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
          return finalURL
        }
      }
      setError(new Error('Failed to get EduConnect login url'))
    } catch (err) {
      setError(err as Error | null)
    }
    return
  }, [])

  // do not call this in native components as it is only defined in web
  const openEduConnectTab = useCallback(async () => {
    const loginUrl = await getLoginUrl()
    globalThis.window.open(loginUrl, '_blank')
  }, [getLoginUrl])

  return { openEduConnectTab, error }
}
