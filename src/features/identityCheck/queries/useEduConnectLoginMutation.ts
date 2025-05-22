import { useMutation } from 'react-query'

import { EduConnectError } from 'features/identityCheck/pages/identification/errors/eduConnect/types'
import { eduConnectClient } from 'libs/eduConnectClient'

export function useEduConnectLoginMutation() {
  const { mutateAsync: getLoginUrl, error } = useMutation<string, EduConnectError | Error>({
    mutationFn: async () => {
      const accessToken = (await eduConnectClient.getAccessToken()) ?? ''

      if (accessToken === '') {
        throw new EduConnectError('Failed to get access token')
      }

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
      throw new EduConnectError('Failed to get EduConnect login url')
    },
  })

  // do not call this in native components as it is only defined in web
  const openEduConnectTab = async () => {
    const loginUrl = await getLoginUrl()
    if (loginUrl) {
      globalThis.window.open(loginUrl, '_blank')
    }
  }

  return { openEduConnectTab, error }
}
