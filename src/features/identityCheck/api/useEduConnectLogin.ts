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

  // do not call this in native components as it is only defined in web
  const openEduConnectTab = useCallback(async () => {
    globalThis.window.open(loginUrl, '_blank')
    // we need to refetch educonnect login url every time we open educonnect tab on web platform to get
    // a new login url, otherwise if we try to refresh or reopen educonnect tab, the login url is invalid
    await getLoginUrl()
  }, [getLoginUrl, loginUrl])

  return { openEduConnectTab, loginUrl, error }
}
